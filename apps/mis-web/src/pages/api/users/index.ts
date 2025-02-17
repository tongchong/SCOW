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

import { route } from "@ddadaal/next-typed-api-routes-runtime";
import { asyncClientCall } from "@ddadaal/tsgrpc-client";
import type { AccountUserInfo } from "@scow/protos/build/server/user";
import { UserServiceClient } from "@scow/protos/build/server/user";
import { authenticate } from "src/auth/server";
import { PlatformRole, UserRole } from "src/models/User";
import { getClient } from "src/utils/client";

export interface GetAccountUsersSchema {
  method: "GET";

  query: {
    accountName: string;
  }

  responses: {
    200: {
      results: AccountUserInfo[];
    }
  }
}

export default route<GetAccountUsersSchema>("GetAccountUsersSchema", async (req, res) => {

  const { accountName } = req.query;

  const auth = authenticate((u) =>
    u.platformRoles.includes(PlatformRole.PLATFORM_ADMIN) ||
    u.accountAffiliations.find((x) => x.accountName === accountName)?.role !== UserRole.USER);

  const info = await auth(req, res);

  if (!info) { return; }

  const client = getClient(UserServiceClient);

  const reply = await asyncClientCall(client, "getAccountUsers", {
    tenantName: info.tenant,
    accountName,
  });

  return {
    200: {
      results: reply.results,
    },
  };

});
