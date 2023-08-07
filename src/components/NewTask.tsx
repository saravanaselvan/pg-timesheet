import {
  Box,
  TextInput,
  Group,
  Button,
  Select,
  NumberInput,
  Text,
} from "@mantine/core";
import { DateInput, DateValue } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  getDocs,
  collection,
  addDoc,
  query,
  where,
  updateDoc,
  DocumentReference,
} from "firebase/firestore";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import PGRichTextEditor from "./PGRichTextEditor";
import { format } from "date-fns";
import { IconCalendar } from "@tabler/icons-react";

const NewTask = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Array<any>>([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [availableTask, setAvailableTask] =
    useState<DocumentReference | null>();

  const form = useForm({
    initialValues: {
      user_id: auth.currentUser?.uid,
      description: "",
      hours_spent: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    loadExistingTask(new Date());
  }, []);

  const updateTaskDescription = (value: string) => {
    setTaskDescription(value);
  };

  const createNewTask = async () => {
    debugger;
    const task: any = form.values;
    if (taskDescription) {
      task.description = taskDescription;
    }
    task.day = new Date(task.date).getDate();
    task.month = new Date(task.date).getMonth() + 1;
    task.year = new Date(task.date).getFullYear();
    task.week = Math.ceil(new Date(task.date).getDate() / 7);
    task.created_at = new Date();
    task.updated_at = new Date();
    task.deleted_at = null;

    if (availableTask) {
      // update doc
      const docRef = await updateDoc(availableTask, task);
    } else {
      const docRef = await addDoc(collection(db, "tasks"), task);
    }

    navigate("/tasks");
  };

  const loadExistingTask = async (value: any) => {
    const day = new Date(value.toString()).getDate();
    const month = new Date(value.toString()).getMonth() + 1;
    const year = new Date(value.toString()).getFullYear();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const q = query(
      collection(db, "tasks"),
      where("user_id", "==", currentUser.uid),
      where("day", "==", day),
      where("month", "==", month),
      where("year", "==", year)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length) {
      setAvailableTask(querySnapshot.docs[0].ref);
      const availableTask = querySnapshot.docs[0].data();
      form.setValues({
        ...availableTask,
      });
    } else {
      setAvailableTask(null);
      form.setValues({
        user_id: currentUser.uid,
        description: "",
        hours_spent: "",
        // date: value,
      });
    }
    form.setFieldValue("date", value);
  };

  const onDateChange = async (value: any) => {
    if (!value) return;
    await loadExistingTask(value);
  };
  return (
    <Box maw={900} mx="auto">
      <form onSubmit={form.onSubmit(createNewTask)}>
        {/* <Select
          label="Select User"
          placeholder="Pick one"
          data={users}
          {...form.getInputProps("user_id")}
        /> */}
        <DateInput
          icon={<IconCalendar size="1.1rem" stroke={1.5} />}
          label="Date"
          placeholder="Date"
          {...form.getInputProps("date")}
          onChange={onDateChange}
          mb={"md"}
          maw={200}
        />

        {/* <TextInput
          withAsterisk
          label="Task Description"
          placeholder="Task Description"
          {...form.getInputProps("description")}
        /> */}
        <Text fz={"sm"} fw={"500"} mb={4}>
          Description
        </Text>
        <PGRichTextEditor
          content={form.getInputProps("description").value}
          onContentChange={updateTaskDescription}
        />
        <NumberInput
          withAsterisk
          label="Hours Spent"
          placeholder="Hours Spent"
          {...form.getInputProps("hours_spent")}
          my={"md"}
          maw={200}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
};

export default NewTask;
