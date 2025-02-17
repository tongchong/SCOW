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

import { loggedExec, sshConnect } from "@scow/lib-ssh";
import { FastifyInstance } from "fastify";
import { AuthProvider } from "src/auth/AuthProvider";
import { serveLoginHtml } from "src/auth/loginHtml";
import { registerPostHandler } from "src/auth/ssh/postHandler";
import { authConfig, SshConfigSchema } from "src/config/auth";
import { clusters } from "src/config/clusters";
import { rootKeyPair } from "src/config/env";
import { ensureNotUndefined } from "src/utils/validations";

function checkLoginNode(sshConfig: SshConfigSchema) {

  let loginNode = sshConfig.baseNode;

  if (!loginNode) {
    if (Object.keys(clusters).length === 0) {
      throw new Error("No cluster has been set in clusters config");
    }
    const clusterConfig = Object.values(clusters)[0];
    loginNode = clusterConfig.slurm.loginNodes[0];

    if (!loginNode) {
      throw new Error(`Cluster ${clusterConfig.displayName} has no login node.`);
    }
  }

  return loginNode;
}

export const createSshAuthProvider = (f: FastifyInstance) => {

  const { ssh } = ensureNotUndefined(authConfig, ["ssh"]);

  const loginNode = checkLoginNode(ssh);

  f.log.info("Determined login node %s", loginNode);

  registerPostHandler(f, loginNode);

  return <AuthProvider>{
    serveLoginHtml: (callbackUrl, req, rep) => serveLoginHtml(false, callbackUrl, req, rep),
    fetchAuthTokenInfo: async () => undefined,
    getUser: async (identityId, req) => {
      return await sshConnect(loginNode, "root", rootKeyPair, req.log, async (ssh) => {
        return loggedExec(ssh, req.log, true, "id", [identityId])
          .then(() => ({ identityId }))
          .catch(() => undefined);
      });
    },
    validateName: undefined,
    createUser: undefined,
    changePassword: undefined,
  };

};
