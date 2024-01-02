import { expect, test } from "@playwright/test";

const handleDialog = async (page, type) => {
  let handleDialog;

  if (type === "logout") {
    const logoutButton = page.getByRole("button", { name: "Logout" });
    handleDialog = async (dialog) => {
      expect(dialog.message()).toEqual("Are you sure you want to log out?");
      await dialog.accept();
    };
    page.on("dialog", handleDialog);
    await logoutButton.click();
  } else {
    const deleteButton = page.getByRole("button", { name: "Delete" });
    handleDialog = async (dialog) => {
      expect(dialog.message()).toEqual("Do you really want to delete this?");
      await dialog.accept();
    };
    page.on("dialog", handleDialog);
    await deleteButton.click();
  }

  page.off("dialog", handleDialog);
};

test.describe("Posts test", () => {
  test.beforeEach(async ({ page }) => {
    if (expect(page).not.toHaveTitle("Login"))
      await page.goto("http://localhost:3000/auth/login");

    const emailInput = page.getByLabel("Email");
    await emailInput.fill("testEmail@test.com");
    const passwordInput = page.getByLabel("Password");
    await passwordInput.fill("password2");

    const submitButton = page.getByRole("button", { name: "Submit" });
    await submitButton.click();
  });

  test.afterEach(async ({ page }) => {
    await handleDialog(page, "logout");
    await expect(page).toHaveTitle("Login");
  });

  test.describe("Render postList", () => {
    test("Render PostList successful", async ({ page }) => {
      await expect(page).toHaveTitle("PostList");
      await page.waitForSelector('[data-testid="post-item"]');
      const postItems = await page.$$('[data-testid="post-item"]');
      expect(postItems.length).toBeGreaterThan(1);
    });
  });

  test.describe("Create a new post", () => {
    test("Create new post successful", async ({ page }) => {
      await expect(page).toHaveTitle("PostList");
      await page.goto("http://localhost:3000/posts/store");
      await expect(page).toHaveTitle("New Post");

      const titleInput = page.getByLabel("Title");
      await titleInput.fill("test title");
      const ContentInput = page.getByLabel("Content");
      await ContentInput.fill("test content");
      const submitButton = page.getByRole("button", { name: "Submit" });
      await submitButton.click();

      await page.waitForSelector('[data-testid="post-item"]');
      await expect(page).toHaveTitle("PostList");
      expect(page.locator("text=test title")).toBeTruthy();
      expect(page.locator("text=test content")).toBeTruthy();
      expect(page.locator("text=store successful.")).toBeTruthy();
    });
  });

  test.describe("Show a post detail", () => {
    test("Show detail successful", async ({ page }) => {
      await page.waitForSelector('[data-testid="post-detail"]');
      const postDetailButtons = await page.$$('[data-testid="post-detail"]');
      const postDetailButton = postDetailButtons[0];
      await page.waitForSelector('[data-testid="post-id"]');
      const postIds = await page.$$('[data-testid="post-id"]');
      const targetPostId = await postIds[0].innerText();

      await postDetailButton.click();

      await expect(page).toHaveTitle("Show Post");
      await page.waitForSelector('[data-testid="show-post-id"]');
      const showPostIds = await page.$$('[data-testid="show-post-id"]');
      const showedPostId = await showPostIds[0].innerText();
      expect(showedPostId).toEqual(targetPostId);
    });
  });

  test.describe("Update a post", () => {
    test("Update post successful", async ({ page }) => {
      await page.waitForSelector('[data-testid="post-detail"]');
      const postDetailButtons = await page.$$('[data-testid="post-detail"]');
      const postDetailButton = postDetailButtons[0];
      await postDetailButton.click();

      await expect(page).toHaveTitle("Show Post");
      await page.click(
        "div.w-20.h-8.flex.justify-center.items-center.bg-orange-500.rounded-lg.text-white a"
      );

      await expect(page).toHaveTitle("Edit Post");
      const titleInput = page.getByLabel("Title");
      const currentTitle = await titleInput.evaluate((input) => input.value);
      const updatedTitle = `${currentTitle} a`;
      await titleInput.fill(updatedTitle);
      const submitButton = page.getByRole("button", { name: "Submit" });
      await submitButton.click();

      await expect(page).toHaveTitle("Show Post");
      expect(page.locator(`text=${updatedTitle}`)).toBeTruthy();
    });
  });

  test.describe("Delete a post detail", () => {
    test("Delete post successful", async ({ page }) => {
      await page.waitForSelector('[data-testid="post-detail"]');
      const postDetailButtons = await page.$$('[data-testid="post-detail"]');
      const postDetailButton = postDetailButtons[1];
      await page.waitForSelector('[data-testid="post-id"]');
      const postIds = await page.$$('[data-testid="post-id"]');
      const deletedPostId = await postIds[1].innerText();

      await postDetailButton.click();
      await expect(page).toHaveTitle("Show Post");

      await handleDialog(page, "delete");

      await expect(page).toHaveTitle("PostList");
      await page.waitForSelector('[data-testid="post-detail"]');
      expect(page.locator(`text=Delete successful.`)).toBeTruthy();
      await page.waitForSelector('[data-testid="post-item"]');
      const postItems = await page.$$('[data-testid="post-item"]');
      postItems.forEach(async (item) => {
        const postText = await item.innerText();
        expect(postText).not.toContain(deletedPostId);
      });
    });
  });
});
