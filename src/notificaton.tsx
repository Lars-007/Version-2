import { Notification } from "@mantine/core";

const NotificationComponent = ({ showNotification }: { showNotification: boolean }) => (
  showNotification ? (
    <Notification color="lime" radius="xs" title="To Do App Notification:">
      Successfully deleted your task
    </Notification>
  ) : null
);

export default NotificationComponent;