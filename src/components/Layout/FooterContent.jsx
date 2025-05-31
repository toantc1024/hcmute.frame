import LOGO from "../../assets/LOGO.svg";
import { ActionIcon, Container, Group, Text } from "@mantine/core";
import classes from "./FooterLinks.module.css";

const data = [
  {
    title: "Liên kết",
    links: [
      {
        label: "Website",
        link: "https://hcmute.edu.vn",
      },
      {
        label: "Facebook Đoàn Thanh niên",
        link: "mailto:Doantruong@hcmute.edu.vn",
      },
      {
        label: "Facebook Hội Sinh viên",
        link: "mailto:Dhspkt@hoisinhvien.vn",
      },
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
    <footer className={classes.footer} >
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <img src={LOGO} alt="Thành Đoàn Logo" className={classes.logoImage} />          <Text size="xl" className={classes.description}>
            <strong>Đoàn Thanh niên - Hội Sinh viên</strong>
            <span>Trường ĐH Sư phạm Kỹ thuật TP. Hồ Chí Minh</span>
            <span>Số 01, Võ Văn Ngân, phường Linh Chiểu, quận Thủ Đức</span>
            <span>
              Email:{" "}
              <a href="mailto:Doantruong@hcmute.edu.vn">Doantruong@hcmute.edu.vn</a> (Đoàn Thanh niên)
            </span>
            <span>
              <a href="mailto:Dhspkt@hoisinhvien.vn">Dhspkt@hoisinhvien.vn</a> (Hội sinh viên)
            </span>
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="md">
          © 2025 Đoàn Thanh niên - Hội Sinh viên Trường ĐH Sư phạm Kỹ thuật TP. Hồ Chí Minh
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
