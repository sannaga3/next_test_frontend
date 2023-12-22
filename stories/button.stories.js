import Button from "../components/button";

export default {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
};

const Template = (args) => <Button {...args} />;

export const Delete = Template.bind({});
Delete.args = {
  text: "削除",
  type: "button",
  onClick: () => {},
  width: 60,
  height: 30,
  textSize: "base",
  useDefaultClass: false,
  classProps:
    "w-20 h-8 flex justify-center items-center bg-red-500 rounded-lg text-white",
  disabled: false,
};
