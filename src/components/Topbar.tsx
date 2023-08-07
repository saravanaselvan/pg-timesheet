import { Badge, Box, Flex, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

const Topbar = () => {
  const [name, setName] = useState("");
  useEffect(() => {
    localStorage.getItem("user") &&
      setName(JSON.parse(localStorage.getItem("user") as any).name);
  }, []);
  return (
    <Flex justify={"flex-end"} mb={14}>
      <Flex gap={4}>
        <Text fz={"sm"}>Welcome</Text>
        <Text fz={"sm"} fw={"600"}>
          <Badge color="grape" radius="md">
            {name}
          </Badge>
        </Text>
      </Flex>
    </Flex>
  );
};

export default Topbar;
