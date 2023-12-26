import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/register";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Register test", () => {
  let usernameInput;
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

    render(<Register />);

    usernameInput = screen.getByLabelText("Username");
    emailInput = screen.getByLabelText("Email");
    passwordInput = screen.getByLabelText("Password");
    submitButton = screen.getByText("Submit");
  });

  it("render Register page", async () => {
    useRouterMock.mockImplementation(() => ({
      push: jest.fn(),
      query: {
        flashMessage: JSON.stringify({
          type: "error",
          messages: [],
        }),
      },
    }));

    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(usernameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it("Register Successful", async () => {
    await userEvent.type(usernameInput, "testUser");
    await userEvent.type(emailInput, "testEmail@test.com");
    await userEvent.type(passwordInput, "password");

    useRouterMock.mockImplementation(() => ({
      push: jest.fn(),
      query: {
        flashMessage: JSON.stringify({
          type: "success",
          messages: ["Register successful."],
        }),
      },
    }));

    const formElement = screen.getByTestId("register-form");
    const submitSpy = jest
      .spyOn(formElement, "submit")
      .mockImplementationOnce(() => {
        return new Promise((resolve) => {
          render(<Login />);
          resolve();
        });
      });
    await submitSpy();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Register successful.")).toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });

  it("valid ", async () => {
    const setFlashMessageMock = jest.fn();
    const useStateMock = jest.fn();
    useStateMock.mockReturnValueOnce(["errors", setFlashMessageMock]);
    await userEvent.type(usernameInput, "te");
    await userEvent.type(emailInput, "errorEmail@test.com");
    await userEvent.type(passwordInput, "pass");

    const submitSpy = jest.fn(() => {
      setFlashMessageMock({
        type: "error",
        messages: [
          "Username must be at least 3 characters",
          "Password must be at least 6 characters",
        ],
      });
    });
    await submitSpy();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
      expect(setFlashMessageMock).toHaveBeenCalledWith({
        type: "error",
        messages: [
          "Username must be at least 3 characters",
          "Password must be at least 6 characters",
        ],
      });
      expect(screen.getByText("Register")).toBeInTheDocument();
    });
  });
});
