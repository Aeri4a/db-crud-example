import { useEffect, useState } from "react";
import "./App.css";
import { ButtonBox, Container, StudentTable } from "./App.styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Input,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Index",
    type: "number",
    flex: 1,
    valueFormatter: ({ value }) => value,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: "grade",
    headerName: "Grade",
    type: "number",
    flex: 1,
    headerAlign: 'center',
    align: 'center'
  },
];

interface StudentData {
  id?: number;
  grade?: number;
}

const initialStudent = {
  id: undefined,
  grade: undefined,
};

enum SaveType {
  POST = "POST",
  PATCH = "PATCH",
}

function App() {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [editData, setEditData] = useState<StudentData>(initialStudent);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [saveType, setSaveType] = useState<SaveType>(SaveType.PATCH);

  const handleAdd = () => {
    setEditData(initialStudent);
    setSaveType(SaveType.POST);
    setIsDialogOpen(true);
  };

  const handleEdit = (row: StudentData) => {
    setEditData({ ...row });
    setSaveType(SaveType.PATCH);
    setIsDialogOpen(true);
  };

  const handleAddStudent = () => {
    const payload = {
      index: editData.id,
      grade: editData.grade,
    };
    axios.post("http://localhost:5000/students", payload);
    setRefresh(!refresh);
    setIsDialogOpen(false);
  };

  const handleSaveStudent = () => {
    const payload = {
      index: editData.id,
      grade: editData.grade,
    };
    axios.patch(`http://localhost:5000/students/${payload.index}`, payload);
    setRefresh(!refresh);
    setIsDialogOpen(false);
  };

  const handleDeleteStudent = () => {
    axios.delete(`http://localhost:5000/students/${editData.id}`);
    setRefresh(!refresh);
    setIsDialogOpen(false);
  }

  useEffect(() => {
    axios.get("http://localhost:5000/students/all").then(({ data }) => {
      const students = data.map(student => ({ id: student.index, grade: student.grade }));
      console.log(students);
      setStudentData(students);
    });
  }, [refresh]);

  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "50px" }}
        >
          <Input
            placeholder="index"
            value={editData.id}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, id: e.target.value }))
            }
          />
          <Input
            placeholder="grade"
            value={editData.grade}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, grade: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          <Button onClick={handleDeleteStudent} variant="contained" color="error">Delete</Button>
          <Button
            onClick={
              saveType === SaveType.POST ? handleAddStudent : handleSaveStudent
            }
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Container>
        <ButtonBox>
          <Button variant="contained" onClick={handleAdd}>
            Add grade
          </Button>
        </ButtonBox>
        <StudentTable>
          <DataGrid
            columns={columns}
            rows={studentData}
            hideFooter={true}
            density="compact"
            autoHeight
            onRowClick={({ row }) => {
              handleEdit(row);
            }}
          />
        </StudentTable>
      </Container>
    </>
  );
}

export default App;
