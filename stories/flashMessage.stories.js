import FlashMessage from "../components/flashMessage";

export default {
  title: "FlashMessage",
  component: FlashMessage,
  tags: ["autodocs"],
};

const Template = (args) => <FlashMessage {...args} />;

export const LoginSuccessful = Template.bind({});
LoginSuccessful.args = {
  flashMessage: {
    type: "success",
    messages: ["Login successful."],
  },
};

export const LoginUserNotFound = Template.bind({});
LoginUserNotFound.args = {
  flashMessage: {
    type: "error",
    messages: ["Login failed. User not found"],
  },
};

export const LoginPasswordDoesNotMatch = Template.bind({});
LoginPasswordDoesNotMatch.args = {
  flashMessage: {
    type: "error",
    messages: ["Login failed. password doesn't match"],
  },
};
