/**
 * Copyright (c) 2022 Peking University and Peking University Institute for Computing and Digital Economy
 * SCOW is licensed under Mulan PSL v2.
 * You can use this software according to the terms and conditions of the Mulan PSL v2.
 * You may obtain a copy of Mulan PSL v2 at:
 *          http://license.coscl.org.cn/MulanPSL2
 * THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
 * MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
 * See the Mulan PSL v2 for more details.
 */

import fs, { existsSync } from "fs";
import { chmod, unlink } from "fs/promises";
import JSZip from "jszip";
import { Octokit } from "octokit";
import prompt from "prompts";
import { debug, log } from "src/log";
import { pipeline } from "stream/promises";


interface Options {
  configPath: string;
  pr: number | undefined;
  release: string | undefined;
  branch: string | undefined;
  downloadPath?: string;
}

const owner = "PKUHPC";
const repo = "SCOW";
const workflow_id = "test-build-publish.yaml";

const allowedArch = ["x64", "arm64"];

function getArch() {
  const arch = process.arch;

  if (!allowedArch.includes(arch)) {
    throw new Error("Unsupported architecture: " + arch);
  }

  return arch;
}

async function getBranchName(prNumber: number, octokit: Octokit) {
  const pr = await octokit.rest.pulls.get({ owner, repo, pull_number: prNumber });

  return pr.data.head.ref;
}

async function download(...params: Parameters<typeof fetch>) {
  const res = await fetch(...params);

  if (!res.ok) {
    throw new Error(`Non-ok response ${res.status} during download. Body: ${await res.text()}`);
  }

  return res.arrayBuffer();
}


export const updateCli = async (options: Options) => {

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const outputPath = options.downloadPath ? options.downloadPath : process.execPath;

  debug("Output path is %s", outputPath);

  if (options.downloadPath && existsSync(outputPath)) {
    const answer = await prompt({
      type: "confirm",
      name: "continue",
      message: `Output path ${outputPath} already exists. Continue?`,
    });
    if (!answer.continue) {
      debug("Selected no.");
      return;
    }
  }

  const arch = getArch();

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  if (options.pr || options.branch) {

    if (!GITHUB_TOKEN) {

      log(`
Download CLI from PR or branch requires GitHub authentication,
and the authenticated user/token must have actions scope.
See: https://docs.github.com/en/rest/actions/artifacts?apiVersion=2022-11-28#download-an-artifact

Please provide your GitHub personal access token via GITHUB_TOKEN in env or .env file.
    `);

      return;
    }

    const user = await octokit.rest.users.getAuthenticated();
    debug("GitHub authenticated %s via GITHUB_TOKEN env.", user.data.login);

    const branch = options.branch ? options.branch : await getBranchName(options.pr!, octokit);
    log("Branch: %s", branch);

    debug("Download cli for PR %s", options.pr);

    const runs = await octokit.rest.actions.listWorkflowRuns({ owner, repo, workflow_id, branch });

    const latestRun = runs.data.workflow_runs[0];

    debug("Latest run: %s. Run URL: %s", String(latestRun.id), latestRun.html_url);


    debug("Architecture: %s", arch);

    const artifacts = await octokit.rest.actions.listWorkflowRunArtifacts({ owner, repo, run_id: latestRun.id });

    const artifactName = "scow-cli-" + arch;

    const artifact = artifacts.data.artifacts.find((a) => a.name === artifactName);

    if (!artifact) {
      throw new Error("Cannot find artifact for architecture " + arch);
    }

    log("Artifact: %s. Download URL: %s", artifact.name, artifact.archive_download_url);

    log("Downloading...");
    const content = await octokit.rest.actions.downloadArtifact({
      owner, repo, artifact_id: artifact.id, archive_format: "zip",
    });

    if (!(content.data instanceof ArrayBuffer)) {
      throw new Error("Downloaded content is not ArrayBuffer");
    }

    log("Download completed. Unzip");
    const binaryName = "cli-" + arch;

    const jszip = new JSZip();
    const zip = await jszip.loadAsync(content.data);
    const file = zip.file(binaryName);

    if (!file) {
      throw new Error("Cannot find binary file " + binaryName);
    }

    await unlink(outputPath);
    await pipeline(file.nodeStream(), fs.createWriteStream(outputPath));
    await chmod(outputPath, 0o755);

    if (options.downloadPath) {
      log("CLI of specified PR or branch has been downloaded to %s", outputPath);
    } else {
      log("CLI has been updated.");
    }

    return;
  }


  const release = await (async function() {
    if (!options.release) {
      log("Neither --pr, --release nor --branch is specified. Downloading latest release.");
      const resp = await octokit.rest.repos.getLatestRelease({ owner, repo });
      log("Latest release is %s.", resp.data.tag_name);
      return resp.data;
    } else {
      log("Downloading release %s", options.release);
      const resp = await octokit.rest.repos.getReleaseByTag({ owner, repo, tag: options.release });
      return resp.data;
    }
  })();

  const assetName = "cli-" + arch;

  const asset = release.assets.find((a) => a.name === assetName);

  if (!asset) {
    throw new Error("Cannot find asset for architecture " + arch);
  }

  log("Asset: %s. Download URL: %s", asset.name, asset.browser_download_url);

  log("Downloading...");
  const content = await download(asset.browser_download_url);

  await unlink(outputPath);
  await fs.promises.writeFile(outputPath, Buffer.from(content));
  await chmod(outputPath, 0o755);

  log("Downloaded release %s", release.name ?? "");
};


