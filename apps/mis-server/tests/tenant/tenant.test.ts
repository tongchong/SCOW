import { Server } from "@ddadaal/tsgrpc-server";
import { asyncClientCall } from "@ddadaal/tsgrpc-utils";
import { ChannelCredentials } from "@grpc/grpc-js";
import { decimalToMoney } from "@scow/lib-decimal";
import { createServer } from "src/app";
import { GetTenantInfoReply, TenantServiceClient } from "src/generated/server/tenant";
import { ormConfigs } from "src/plugins/orm";
import { InitialData, insertInitialData } from "tests/data/data";


let server: Server;
let data: InitialData;

beforeEach(async () => {

  server = await createServer();

  const em = server.ext.orm.em.fork();

  data = await insertInitialData(em);

  await server.start();

});

afterEach(async () => {
  await server.ext.orm.getSchemaGenerator().dropDatabase(ormConfigs.dbName!);
  await server.close();
});

it("gets tenant info", async () => {
  const client = new TenantServiceClient(server.serverAddress, ChannelCredentials.createInsecure());

  const info  = await asyncClientCall(client, "getTenantInfo", { tenantName: data.tenant.name });

  expect(info).toEqual({
    accountCount: 2,
    userCount: 2,
    balance: decimalToMoney(data.tenant.balance),
    admins: [data.userA].map((x) => ({ userId: x.id + "", userName: x.name })),
  } as GetTenantInfoReply);


});
