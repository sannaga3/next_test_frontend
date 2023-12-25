import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Login from "../../pages/auth/Login";
import PostList from "../../pages/posts/index";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Login test", () => {
  let emailInput;
  let passwordInput;
  let submitButton;
  let useRouterMock;

  beforeEach(() => {
    jest.resetAllMocks();
    useRouterMock = jest.fn();
    useRouterMock.mockImplementation(() => ({
      isReady: false,
      push: jest.fn(),
      query: {
        flashMessage: JSON.stringify({
          type: "error",
          messages: [],
        }),
      },
    }));
    require("next/router").useRouter = useRouterMock;

    render(<Login />);

    emailInput = screen.getByLabelText("Email");
    passwordInput = screen.getByLabelText("Password");
    submitButton = screen.getByText("Submit");
  });

  it("render Login page", async () => {
    useRouterMock.mockImplementation(() => ({
      push: jest.fn(),
      query: {
        flashMessage: JSON.stringify({
          type: "error",
          messages: [],
        }),
      },
    }));

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it("Login Successful", async () => {
    await userEvent.type(emailInput, "testEmail@test.com");
    await userEvent.type(passwordInput, "password");

    useRouterMock.mockImplementation(() => ({
      push: jest.fn(),
      query: {
        flashMessage: JSON.stringify({
          type: "success",
          messages: ["Login successful."],
        }),
      },
    }));

    const formElement = screen.getByTestId("login-form");
    const submitSpy = jest
      .spyOn(formElement, "submit")
      .mockImplementationOnce(() => {
        return new Promise((resolve) => {
          render(<PostList />);
          resolve();
        });
      });
    await submitSpy();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Login successful.")).toBeInTheDocument();
      expect(screen.getByText("PostList")).toBeInTheDocument();
    });
  });

  it("User not found", async () => {
    await userEvent.type(emailInput, "errorEmail@test.com");
    await userEvent.type(passwordInput, "password");

    const formElement = screen.getByTestId("login-form");
    const submitSpy = jest
      .spyOn(formElement, "submit")
      .mockImplementationOnce(() => {
        return new Promise(async (resolve) => {
          await useRouterMock.mockImplementation(() => ({
            push: jest.fn(),
            query: {
              flashMessage: JSON.stringify({
                type: "error",
                messages: ["Login failed. User not found"],
              }),
            },
          }));
          resolve();
        });
      });

    await submitSpy();
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Login failed. User not found")
      ).toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });
});
