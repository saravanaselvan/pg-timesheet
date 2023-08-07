import { Box, TextInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { SyntheticEvent, useState } from "react";

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleLogin = async () => {
    const { email, password } = form.values;
    try {
      setIsLoading(true);
      const userCredential: any = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      const user = userCredential.user;

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs[0].data();
      const role = userData.role;
      const loginUser = {
        ...auth.currentUser,
        name: `${userData.first_name} ${userData.last_name}`,
      };
      localStorage.setItem("user", JSON.stringify(loginUser));
      setIsLoading(false);
      navigate("/tasks");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };
  return (
    <Box w={"50%"}>
      <form onSubmit={form.onSubmit(handleLogin)}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
        />
        <TextInput
          type="password"
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />
        <Group position="right" mt="md">
          <Button type="submit" loading={isLoading}>
            Signin
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Signin;
