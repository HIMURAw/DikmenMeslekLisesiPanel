import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table"

export default function LessonTable() {

  const lessons = [
    { hour: "1", lesson: "Matematik", teacher: "Ali Hoca" },
    { hour: "2", lesson: "Fizik", teacher: "Mehmet Hoca" },
    { hour: "3", lesson: "Türkçe", teacher: "Ayşe Hoca" },
  ]

  return (
    <Table>

      <TableHeader>
        <TableRow>
          <TableHead>Ders Saati</TableHead>
          <TableHead>Ders</TableHead>
          <TableHead>Öğretmen</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {lessons.map((lesson,i)=>(
          <TableRow key={i}>
            <TableCell>{lesson.hour}</TableCell>
            <TableCell>{lesson.lesson}</TableCell>
            <TableCell>{lesson.teacher}</TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  )
}