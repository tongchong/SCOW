import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { requireAuth } from "src/auth/requireAuth";
import { NotFoundPage } from "src/components/errorPages/NotFoundPage";
import { getHome } from "src/pageComponents/filemanager/api";
import { FileManager } from "src/pageComponents/filemanager/FileManager";
import { publicConfig } from "src/utils/config";
import { Head } from "src/utils/head";

export const FileManagerPage: NextPage = requireAuth(() => true)(() => {

  if (publicConfig.FILE_SERVERS.length === 0) {
    return <NotFoundPage />;
  }

  const router = useRouter();
  const pathParts = router.query.path as (string[] | undefined);

  const cluster = router.query.cluster as string;
  const fullPath = (pathParts && pathParts.length === 1 && pathParts[0] === "~")
    ? "~"
    : "/" + (pathParts?.join("/") ?? "");

  const homePathMemo = useRef<string | undefined>(undefined);

  const getHomePath = async () => {
    return homePathMemo.current
    ?? (homePathMemo.current = await getHome({ cluster }).then((x) => x.path));
  };


  useEffect(() => {
    if (pathParts && pathParts.length === 1 && pathParts[0] === "~") {
      getHomePath().then((path) => {
        router.push(`/files/${cluster}/${path}`);
      });
    }
  }, [fullPath]);

  return (
    <>
      <Head title={`${publicConfig.CLUSTER_NAMES[cluster] ?? cluster}文件管理`}/>
      <FileManager
        cluster={cluster}
        path={fullPath}
        urlPrefix="/files"
      />
    </>
  );
});

export default FileManagerPage;
