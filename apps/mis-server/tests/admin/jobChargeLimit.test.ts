import { Server } from "@ddadaal/tsgrpc-server";
import { asyncClientCall } from "@ddadaal/tsgrpc-utils";
import { ChannelCredentials } from "@grpc/grpc-js";
import { SqlEntityManager } from "@mikro-orm/mysql";
import { Decimal, decimalToMoney } from "@scow/lib-decimal";
import { createServer } from "src/app";
import { UserAccount, UserStatus } from "src/entities/UserAccount";
import { JobChargeLimitServiceClient } from "src/generated/server/jobChargeLimit";
import { ormConfigs } from "src/plugins/orm";
import { reloadEntity } from "src/utils/orm";
import { InitialData, insertInitialData } from "tests/data/data";

let server: Server;
let em: SqlEntityManager;
let client: JobChargeLimitServiceClient;
let data: InitialData;
let ua: UserAccount;

beforeEach(async () => {
  server = await createServer();
  await server.start();

  client = new JobChargeLimitServiceClient(server.serverAddress, ChannelCredentials.createInsecure());

  em = server.ext.orm.em.fork();

  data = await insertInitialData(em);

  ua = data.uaAA;
});

afterEach(async () => {
  await server.ext.orm.getSchemaGenerator().dropDatabase(ormConfigs.dbName!);
  await server.close();
});

const params = (ua: UserAccount) => ({
  accountName: ua.account.getEntity().accountName,
  userId: ua.user.getEntity().userId,
  tenantName: data.tenant.name,
});

function expectDecimalEqual(decimal1?: Decimal, decimal2?: Decimal) {
  expect(decimal1?.toNumber()).toBe(decimal2?.toNumber());
}

it("sets job charge limit", async () => {
  const limit = new Decimal(100);

  expect(ua.jobChargeLimit).toBeUndefined();

  await asyncClientCall(client, "setJobChargeLimit", {
    ...params(ua), limit: decimalToMoney(limit),
  });

  await reloadEntity(ua);

  expectDecimalEqual(ua.jobChargeLimit, limit);
  expectDecimalEqual(ua.usedJobCharge, new Decimal(0));
});

it("changes job charge limit", async () => {
  const limit = new Decimal(100);

  ua.jobChargeLimit = limit;
  ua.usedJobCharge = new Decimal(0);
  await em.flush();

  expectDecimalEqual(ua.jobChargeLimit, limit);
  expectDecimalEqual(ua.usedJobCharge, new Decimal(0));

  const newLimit = new Decimal(20);

  await asyncClientCall(client, "setJobChargeLimit", { ...params(ua), limit: decimalToMoney(newLimit) });

  await reloadEntity(ua);

  expectDecimalEqual(ua.jobChargeLimit, newLimit);
});

it("cancels job charge limit", async () => {
  const limit = new Decimal(100);

  ua.jobChargeLimit = limit;
  await em.flush();

  expectDecimalEqual(ua.jobChargeLimit, limit);

  await asyncClientCall(client, "cancelJobChargeLimit", { ...params(ua) });

  await reloadEntity(ua);

  expect(ua.jobChargeLimit).toBeUndefined();
  expect(ua.usedJobCharge).toBeUndefined();
});

it("adds job charge", async () => {
  const limit = new Decimal(100);
  ua.jobChargeLimit = limit;
  ua.usedJobCharge = new Decimal(0);
  await em.flush();

  expectDecimalEqual(ua.jobChargeLimit, limit);

  const charge = new Decimal(20.4);

  await ua.addJobCharge(charge, server.ext);

  expectDecimalEqual(ua.usedJobCharge, charge);
  expectDecimalEqual(ua.jobChargeLimit, limit);
  expect(ua.status).toBe(UserStatus.UNBLOCKED);
});

it("blocks user if used > limit", async () => {
  const limit = new Decimal(100);
  ua.jobChargeLimit = limit;
  ua.usedJobCharge = new Decimal(0);
  await em.flush();

  expectDecimalEqual(ua.jobChargeLimit, limit);

  const charge = new Decimal(120.4);
  await ua.addJobCharge(charge, server.ext);

  expectDecimalEqual(ua.usedJobCharge, charge);
  expectDecimalEqual(ua.jobChargeLimit, limit);
  expect(ua.status).toBe(UserStatus.BLOCKED);
});

it("unblocked user if limit is changed to >= used", async () => {
  const limit = new Decimal(100);
  ua.jobChargeLimit = limit;
  ua.usedJobCharge = limit.plus(20);
  ua.status = UserStatus.BLOCKED;
  await em.flush();

  const newLimit = new Decimal(140);
  await asyncClientCall(client, "setJobChargeLimit", { ...params(ua), limit: decimalToMoney(newLimit) });

  await reloadEntity(ua);
  expectDecimalEqual(ua.jobChargeLimit, newLimit);
  expect(ua.status).toBe(UserStatus.UNBLOCKED);

});

it("unblocks user if limit >= used is positive", async () => {
  const limit = new Decimal(100);
  ua.jobChargeLimit = limit;
  ua.usedJobCharge = limit.plus(20);
  ua.status = UserStatus.BLOCKED;
  await em.flush();

  const charge = new Decimal(-20.4);

  await ua.addJobCharge(charge, server.ext);

  expectDecimalEqual(ua.jobChargeLimit, limit);
  expectDecimalEqual(ua.usedJobCharge, new Decimal(99.6));
  expect(ua.status).toBe(UserStatus.UNBLOCKED);
});

it("does nothing if no limit", async () => { const charge = new Decimal(120.4);
  await ua.addJobCharge(charge, server.ext);

  expect(ua.jobChargeLimit).toBeUndefined();
  expect(ua.usedJobCharge).toBeUndefined();
  expect(ua.status).toBe(UserStatus.UNBLOCKED);
});

// it("correctly handles multiple concurrent request", async () => {

//   const aa = data.uaAA;
//   const bb = data.uaBB;
//   const ab = data.uaAB;

//   aa.jobChargeLimit = new Decimal(10);
//   aa.usedJobCharge = new Decimal(2);
//   bb.jobChargeLimit = new Decimal(12);
//   bb.usedJobCharge = new Decimal(0);

//   await server.ext.orm.em.flush();

//   const deltas = [
//     { ...params(aa), charge: decimalToMoney(new Decimal(10))  },
//     { ...params(aa), charge: decimalToMoney(new Decimal(12))  },
//     { ...params(bb), charge: decimalToMoney(new Decimal(-12))  },
//     { ...params(aa), charge: decimalToMoney(new Decimal(-6))  },
//     { ...params(bb), charge: decimalToMoney(new Decimal(14))  },
//     { ...params(ab), charge: decimalToMoney(new Decimal(14))  },
//   ] as AddJobChargeRequest[];

//   await Promise.all(deltas.map((x) => asyncClientCall(client, "addJobCharge", x)));

//   await reloadEntities([aa, bb, ab]);

//   expectDecimalEqual(aa.usedJobCharge, new Decimal(18));
//   expect(aa.status).toBe(UserStatus.BLOCKED);

//   expectDecimalEqual(bb.usedJobCharge, new Decimal(2));
//   expect(bb.status).toBe(UserStatus.UNBLOCKED);

//   expect(ab.usedJobCharge).toBeUndefined();
//   expect(ab.status).toBe(UserStatus.UNBLOCKED);

// });
