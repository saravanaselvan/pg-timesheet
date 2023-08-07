import { Box, Button, Table } from "@mantine/core";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(querySnapshot.docs);
    };
    fetchUsers();
  }, []);
  return (
    <Box maw={900} mx="auto" p={20}>
      <Button component={Link} to={"/users/new"}>
        New User
      </Button>
      <Table striped withBorder mt={16}>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>
                {user.data().first_name} {user.data().last_name}
              </td>
              <td>{new Date(user.data().dob.seconds * 1000).toString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default Users;
