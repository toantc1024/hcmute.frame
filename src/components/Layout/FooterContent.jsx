import LOGO from "../../assets/LOGO.png";
import { ActionIcon, Container, Group, Text } from "@mantine/core";
import classes from "./FooterLinks.module.css";

const data = [
  {
    title: "Liên kết",
    links: [
      {
        label: "Facebook",
        link: "https://www.facebook.com/thanhdoanthanhphohochiminh",
      },
      { label: "Email", link: "thanhdoan@tphcm.gov.vn" },
    ],
  },
];

export default function FooterLinks() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => {
          event.preventDefault();
          window.open(link.link, "_blank");
        }}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <img src={LOGO} alt="Thành Đoàn Logo" className={classes.logoImage} />
          <Text size="xl" className={classes.description}>
            <strong>Thành Đoàn TP.HCM</strong>
            <span>Số 1 Phạm Ngọc Thạch, Quận 1, TP HCM</span>
            <span>Tel: (84.8) 38225124 - 38225146</span>
            <span>Fax: (84.8) 38244705</span>
            <span>
              Email:{" "}
              <a href="mailto:thanhdoan@tphcm.gov.vn">thanhdoan@tphcm.gov.vn</a>
            </span>
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="md">
          © 2025 Thành Đoàn TP.HCM
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        ></Group>
      </Container>
    </footer>
  );
}
