import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

const Signup = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      dob: "",
      joining_date: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const createNewUser = async () => {
    const user: any = form.values;
    user.created_at = new Date();
    user.updated_at = new Date();
    user.deleted_at = null;

    const docRef = await addDoc(collection(db, "users"), user);
    navigate("/");
  };
  return (
    <Box w={"50%"}>
      <form onSubmit={form.onSubmit(createNewUser)}>
        <TextInput
          withAsterisk
          label="First Name"
          placeholder="First Name"
          {...form.getInputProps("first_name")}
        />
        <TextInput
          withAsterisk
          label="Last Name"
          placeholder="Last Name"
          {...form.getInputProps("last_name")}
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
        />
        <TextInput type="password" label="Password" placeholder="Password" />
        <TextInput
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password"
        />
        <DateInput
          label="Date of Birth"
          placeholder="Date of Birth"
          {...form.getInputProps("dob")}
        />
        <DateInput
          label="Joining Date"
          placeholder="Joining Date"
          {...form.getInputProps("joining_date")}
        />
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
};

export default Signup;
