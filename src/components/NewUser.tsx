import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const NewUser = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
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
    <Box maw={900} mx="auto">
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

export default NewUser;
