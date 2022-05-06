import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { User } from "src/stores/UserStore";
import { SHELL_SERVER_URL } from "src/utils/config";
import styled from "styled-components";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const TerminalContainer = styled.div`
  background-color: black;
  flex: 1;

  // https://github.com/xtermjs/xterm.js/issues/3564#issuecomment-1034107272
  .xterm-viewport {
    width: initial !important;
  }
`;

interface Props {
  user: User;
  cluster: string;
  path: string;
}


export const Shell: React.FC<Props> = ({ user, cluster, path }) => {

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {

      const term = new Terminal({ cursorBlink: true });

      const payload = {
        cluster,
        path,
        cols: term.cols + "",
        rows: term.rows + "",
      };

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(container.current);

      const resize = () => {
        fitAddon.fit();
      };


      term.write(
        `\r\n*** Connecting to cluster ${payload.cluster} as ${user.identityId} to ` +
        `${path ? "path " + path : "home path"} ***\r\n`,
      );


      const resizeObserver = new ResizeObserver(resize);

      resizeObserver.observe(container.current);

      const url = new URL(SHELL_SERVER_URL, location.origin);

      const socket = io(url.origin, {
        path: url.pathname,
        query: payload,
        auth: { token: user.token },
      });

      socket.on("connect", () => {
        term.clear();
        resize();
        term.onData((data) => {
          socket.emit("data", data);
        });

        term.onResize(({ cols, rows }) => {
          socket.emit("resize", { cols, rows });
        });

        socket.on("data", (data) => {
          term.write(data);
        });

        socket.on("exit", (e: { exitCode: number, signal?: number }) => {
          term.write(`Process exited with code ${e.exitCode}.`);
        });

        socket.on("disconnect", () => {
          term.write("\r\n*** Disconnected.***\r\n");
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [container.current]);

  return (
    <TerminalContainer ref={container} />
  );
};
