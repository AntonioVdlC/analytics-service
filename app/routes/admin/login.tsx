import { ActionFunction, Form, useActionData } from "remix";
import { db } from "~/utils/db.server";
import {
  createAdminSession,
  generateRandomString,
} from "~/utils/session.server";

type ActionData = {
  tokenSent: Boolean;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const action = form.get("_action");

  switch (action) {
    case "create": {
      const token = await db.adminToken.create({
        data: {
          value: generateRandomString(16),
          validUntil: new Date(Date.now() + 5 * 60 * 1000), // in 5 minutes
        },
      });

      // TODO: send to ADMIN_EMAIL
      console.log(`emailto: ${process.env.ADMIN_EMAIL}`, token.value);

      return { tokenSent: true };
    }
    case "validate": {
      const inputToken = form.get("token");
      if (!inputToken || typeof inputToken !== "string") {
        throw new Error("No token provided");
      }

      const token = await db.adminToken.findFirst({
        where: {
          value: inputToken,
          isUsed: false,
          validUntil: { gte: new Date(Date.now()) },
        },
      });

      if (!token) {
        throw new Error("Token not valid.");
      }

      await db.adminToken.update({
        data: {
          isUsed: true,
        },
        where: { id: token.id },
      });

      const session = await db.adminSession.create({
        data: {
          token: generateRandomString(32),
          validUntil: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        },
      });

      return createAdminSession(session);
    }
  }

  return null;
};

export default function AdminLoginRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <>
      <Form method="post">
        <button type="submit" name="_action" value="create">
          Create Token
        </button>
      </Form>

      {actionData?.tokenSent ? <p>Token sent.</p> : null}

      <Form method="post">
        <input type="text" name="token" />
        <button type="submit" name="_action" value="validate">
          Validate Token
        </button>
      </Form>
    </>
  );
}
