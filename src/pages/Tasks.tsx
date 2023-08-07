import {
  Box,
  Button,
  Flex,
  SegmentedControl,
  Select,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { format, getWeek, getWeekOfMonth } from "date-fns";
import { MonthPickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconEdit,
  IconRowRemove,
  IconTrash,
  IconTrashFilled,
  IconTrashXFilled,
} from "@tabler/icons-react";
import { InputLabel } from "@mantine/core/lib/Input/InputLabel/InputLabel";
import { FirebaseError } from "firebase/app";
import { utils, writeFile } from "xlsx";
import { modals } from "@mantine/modals";
const { convert } = require("html-to-text");

const Tasks = () => {
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [monthYear, setMonthYear] = useState<any>(new Date());
  const [week, setWeek] = useState(getWeekOfMonth(new Date()).toString());
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const month = new Date(monthYear).getMonth() + 1;
    const year = new Date(monthYear).getFullYear();
    const queryConstraints = [
      where("user_id", "==", currentUser.uid),
      where("month", "==", month),
      where("year", "==", year),
    ];
    if (week !== "all") {
      queryConstraints.push(where("week", "==", parseInt(week)));
    }
    const q = query(
      collection(db, "tasks"),
      ...queryConstraints
      //   orderBy("date")
    );
    try {
      const querySnapshot = await getDocs(q);
      setTasks(
        querySnapshot.docs.sort((a, b) => a.data().date - b.data().date)
      );
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.code);
      console.log(error.name);
      console.log(errorCode, errorMessage);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [monthYear, week]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const HtmlToPlainText = (html: string) => {
    const plainText = html
      .replace(/<\/p?>/gi, "\r\n")
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace non-breaking space with regular space
      .replace(/&lt;/g, "<") // Replace HTML entities
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/<br\s*[/]?>/gi, "\n"); // Replace <br> tags with line breaks

    return plainText;
  };

  const downloadExcel = () => {
    /* generate worksheet from state */
    const timesheet = tasks
      .map((task) => task.data())
      .map((task) => ({
        date: format(new Date(task.date.seconds * 1000), "MMM dd, yyyy"),
        description: HtmlToPlainText(task.description),
        hours_spent: task.hours_spent,
      }));
    const ws = utils.json_to_sheet(timesheet);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, `Week ${week}`);
    utils.sheet_add_aoa(ws, [["Date", "Description of Tasks", "Hours"]], {
      origin: "A1",
    });
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    /* export to XLSX */
    writeFile(
      wb,
      `${currentUser.name}_${format(
        new Date(monthYear),
        "MMM-dd-yyyy"
      )}_${week}.xlsx`
    );
  };

  const deleteConfirmModal = (id: string) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Text size="sm">Are you sure to delete this task?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        deleteTask(id);
      },
    });

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, `tasks/${id}`));
      fetchTasks();
    } catch (error: any) {
      console.log(error);
    }
  };

  const editTask = (id: string) => {
    navigate(`/tasks/${id}/edit`);
  };
  return (
    <Box>
      <Flex align={"center"} gap={8} justify={"space-between"}>
        <Flex align={"center"} gap={8}>
          <Text fz={"sm"} fw={"bolder"}>
            Pick Month/Year:
          </Text>
          <MonthPickerInput
            icon={<IconCalendar size="1.1rem" stroke={1.5} />}
            placeholder="Pick date"
            value={monthYear}
            onChange={setMonthYear}
          />
          <Text fz={"sm"} fw={"bolder"}>
            Week:
          </Text>

          <SegmentedControl
            radius={"sm"}
            color="dark"
            data={[
              { value: "all", label: "All" },
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ]}
            value={week}
            onChange={(value: string) => setWeek(value)}
          />
        </Flex>
        <Button onClick={downloadExcel}>Download Excel</Button>
        <Button component={Link} to={"/tasks/new"}>
          New Task
        </Button>
      </Flex>
      <Table striped withBorder mt={16}>
        <thead>
          <tr>
            <th>Date</th>
            {/* <th>Month</th> */}
            <th>Description</th>
            <th>Hours Spent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr key={task.id}>
              <td>
                {format(
                  new Date(task.data().date.seconds * 1000),
                  "MMM dd, yyyy"
                )}
              </td>
              {/* <td>{task.data().month}</td> */}
              <td
                dangerouslySetInnerHTML={{ __html: task.data().description }}
              ></td>
              <td>{task.data().hours_spent}</td>
              <td>
                <Tooltip
                  label="Edit Task"
                  position="bottom"
                  withArrow
                  color="blue"
                >
                  <IconEdit
                    color={"#228be6"}
                    cursor="pointer"
                    onClick={() => editTask(task.id)}
                  />
                </Tooltip>
                <Tooltip
                  label="Remove Task"
                  position="bottom"
                  withArrow
                  color="red"
                >
                  <IconTrash
                    color="red"
                    cursor="pointer"
                    onClick={() => deleteConfirmModal(task.id)}
                  />
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default Tasks;
