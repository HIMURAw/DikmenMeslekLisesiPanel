import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DutyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bugünün Nöbetçileri</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">

        <p>👨‍🏫 Ahmet Yılmaz</p>
        <p>👨‍🏫 Ayşe Demir</p>
        <p>👨‍🏫 Mehmet Kaya</p>

      </CardContent>
    </Card>
  )
}