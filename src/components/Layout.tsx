import {
  Box,
  Container,
  Divider,
  Grid,
  SimpleGrid,
  Stack,
  px,
} from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";
import { Nav } from "./Nav";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <Box>
      <Grid grow maw={1300} m={"auto"}>
        <Grid.Col span={2}>
          <Nav />
        </Grid.Col>
        <Grid.Col span={8} pt={30}>
          <Topbar />
          <Divider mb={20} />
          <Outlet />
        </Grid.Col>
      </Grid>
    </Box>
    // <Box>
    // </Box>
  );
};

export default Layout;
