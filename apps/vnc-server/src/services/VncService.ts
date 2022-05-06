import { Logger, plugin } from "@ddadaal/tsgrpc-server";
import { NodeSSH } from "node-ssh";
import path from "path";
import { config, nodes } from "src/config";
import { VncServiceServer, VncServiceService } from "src/generated/vnc/vnc";
import { displayIdToPort } from "src/utils/port";


export function parseListOutput(output: string): number[] {
  const ids = [] as number[];
  for (const line of output.split("\n")) {
    if (line.startsWith(":")) {
      const parts = line.split(" ");
      ids.push(parseInt(parts[0].substring(1)));
    }
  }

  return ids;
}

export function parseOtp(output: string, logger: Logger): string {
  const indicator = "Full control one-time password: ";
  for (const line of output.split("\n")) {
    if (line.startsWith(indicator)) {
      return line.substring(indicator.length).trim();
    }
  }

  logger.error("No otp from output %s", output);
  throw new Error("No otp from output");
}

export function parseDisplayId(output: string, logger: Logger): number {

  function fail(): never {
    logger.error("No display id from output %s", output);
    throw new Error("No display id from output");
  }

  const firstNonEmptyLine = output.split("\n").find((x) => x);
  if (!firstNonEmptyLine) { fail(); }

  const contents = firstNonEmptyLine.split(":");
  return +contents[contents.length-1];

}

const vncServerPath = path.join(config.TURBOVNC_PATH, "bin", "vncserver");
const vncPasswdPath = path.join(config.TURBOVNC_PATH, "bin", "vncpasswd");

export const vncServiceServer = plugin((server) => {

  const refreshPassword = async (ssh: NodeSSH, username: string, displayId: number) => {
    const { stderr } = await server.ext.runAsUser(ssh, username, vncPasswdPath, "-o", "-display", ":" + displayId);
    return parseOtp(stderr, server.logger);
  };

  server.addService<VncServiceServer>(VncServiceService, {
    launchDesktop: async ({ request }) => {
      const { username }  = request;

      const node = Object.keys(nodes)[0];

      return await server.ext.connect(node, async (ssh, nodeAddr) => {

        // find if the user has running session
        let resp = await server.ext.runAsUser(ssh, username,
          vncServerPath, "-list",
        );

        const ids = parseListOutput(resp.stdout);

        if (ids.length === 0) {
          // start a session
          resp = await server.ext.runAsUser(ssh, username,
            // explicitly set securitytypes to avoid requiring setting vnc passwd
            // TODO adds more desktop supprt other than xfce
            vncServerPath, "-securitytypes", "OTP", "-otp", "-wm", "xfce");

          // parse the OTP from output. the output was in stderr
          const password = parseOtp(resp.stderr, server.logger);

          // parse display id from output
          const displayId = parseDisplayId(resp.stderr, server.logger);

          // start websockify
          const port = displayIdToPort(displayId);

          return [{ alreadyRunning: false, node: nodeAddr, password, port, displayId }];
        } else {

          const displayId = ids[0];

          // refresh the otp
          const password = await refreshPassword(ssh, username, displayId);

          return [{ alreadyRunning: true, displayId, node: nodeAddr, port: displayIdToPort(displayId), password }];

        }
      });

    },

    refreshOTPPassword: async ({ request }) => {
      const { displayId, node, username } = request;

      return await server.ext.connect(node, async (ssh) => {
        const password = await refreshPassword(ssh, username, displayId);

        return [{ password }];
      });

    },
  });
});
