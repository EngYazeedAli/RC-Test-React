import useLoading from "@/hooks/use-loading";
import useSession from "@/hooks/use-session";
import useWarningDialog from "@/hooks/use-warning-dialog";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import styles from "@/styles/employee/attendance.module.css";
import { Table } from "react-bootstrap";
import { Calendar } from "lucide-react";

function EmployeeAttendanceScreen({ id }) {
  const { openWarningDialog, closeWarningDialog } = useWarningDialog();
  const { setLoading } = useLoading();
  const { session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "get-attendances"],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/attendance-records/" +
          id,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
  });

  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  React.useEffect(() => {
    if (error) {
      openWarningDialog({
        title: "Error",
        content: error.message,
      });
    }
  }, [error, openWarningDialog]);
  return (
    <section className={styles.main}>
      <h1>
        <span>
          <Calendar size={38} />
        </span>
        Attendance History
      </h1>
      <br />
      {!isLoading &&
        !error &&
        (data?.length < 1 ? (
          <p>No Attendance Yet</p>
        ) : (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Day</th>
                <th>Checked In</th>
                <th>Checked Out</th>
                <th>Working Hours</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((attendance, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {moment(attendance.attendance_date).format("DD/MM/YYYY")}
                  </td>
                  <td>{moment(attendance.attendance_date).format("dddd")}</td>
                  <td>
                    {attendance.check_in
                      ? moment(attendance.check_in).format("hh:mm A")
                      : "No"}
                  </td>
                  <td>
                    {attendance.check_out
                      ? moment(attendance.check_out)
                          .format("hh:mm A")
                      : "No"}
                  </td>
                  <td>{attendance.attended_hours}</td>
                  <td>
                    {attendance.late_mark
                      ? "Late attendance"
                      : ""}
                    <div
                      style={{
                        color: "cyan",
                      }}
                    >
                      {!attendance.late_mark ? "" : (attendance.late_reason?.length > 1)
                        ? ("Reason: " + attendance.late_reason)
                        : "Reason: no reason"}
                    </div>
                    <br />
                    {attendance.leave_mark
                      ? "Early leave"
                      : ""}
                    <div
                      style={{
                        color: "cyan",
                      }}
                    >
                      {!attendance.leave_mark ? "" : attendance.lave_reason?.length > 1
                        ? ("Reason: " + attendance.lave_reason)
                        : "Reason: no reason"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ))}
    </section>
  );
}

export default EmployeeAttendanceScreen;
