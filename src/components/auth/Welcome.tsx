import { Box, Flex, Grid, SegmentedControl } from "@mantine/core";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Nav } from "../Nav";
import Signup from "./Signup";
import Signin from "./Signin";

const Welcome = () => {
  const [component, setComponent] = useState("signin");
  return (
    <Flex
      direction={"column"}
      justify={"center"}
      align={"center"}
      h={"100vh"}
      maw={600}
      mx="auto"
    >
      <Flex
        sx={{
          borderRadius: "6px",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
        }}
        bg={"gray.1"}
        direction={"column"}
        justify={"flex-start"}
        align={"center"}
        gap={40}
        py={20}
        w={"100%"}
      >
        <SegmentedControl
          radius={"xl"}
          color="dark"
          data={[
            { label: "Sign In", value: "signin" },
            { label: "Sign Up", value: "signup" },
          ]}
          value={component}
          onChange={(value) => setComponent(value)}
        />
        {component === "signin" ? <Signin /> : <Signup />}
      </Flex>
    </Flex>
  );
};

export default Welcome;
