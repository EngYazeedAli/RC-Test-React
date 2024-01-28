import { Calendar, CheckCircle, DoorOpen, Info, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { Button } from "react-bootstrap";
import styles from "@/styles/employee/id.module.css";

const EmployeeActions = ({
    id,
    checkData,
    onCheckIn,
    onCheckOut,
  }) => {
    // console.log({
    //   checkData,
    
    // })
    return (
      <section className={styles.actions}>
          <div className={styles.wrapper}>
            <Button
              variant="primary"
              disabled={
                checkData?.attendance_record?.checked_in ||
                moment().isBefore(moment({ hour: 7, minute: 0 }))
              }
              onClick={onCheckIn}
            >
              <CheckCircle />
              Check In
            </Button>
          </div>
          <div className={styles.wrapper}>
            <Button
              variant="danger"
              onClick={onCheckOut}
              disabled={
                checkData?.attendance_record?.checked_out ||
                !checkData?.attendance_record?.checked_in
              }
            >
              <DoorOpen />
              Check Out
            </Button>
          </div>
          <div className={styles.wrapper}>
            <Link
              href={`/user/${id}/attendance`}
            >
              <Button
                variant="secondary"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "15px",
                }}
              >
                <Calendar />
                Attendance History
              </Button>
            </Link>
          </div>
        </section>
    )
  }

export default EmployeeActions