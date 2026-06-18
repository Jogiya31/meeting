const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../db/connection");

const spMap = {
  1: "P_GetUser",
  2: "P_InsertUser",
  3: "P_UpdateUser",
  4: "P_GetDesignation",
  5: "P_SaveDesignation",
  6: "P_UpdateDesignation",
  7: "P_GetDivision",
  8: "P_SaveDivision",
  9: "P_UpdateDivision",
  10: "P_GetOrganisation",
  11: "P_SaveOrganisation",
  12: "P_GetEmployement",
  13: "P_SaveEmployement",
  14: "P_UpdateEmployement",
  15: "P_GetMeeting",
  16: "P_SaveMeeting",
  17: "P_SaveDiscussionPoint",
  18: "P_UpdateDiscussionPoint",
  19: "P_SaveStatus",
  20: "P_GetLoginUser",
  21: "P_UpdateStatus",
  22: "P_GetStatus",
  23: "P_UpdateMeeting",
  24: "P_UpdateAttendance",
  25: "P_GetProject",
  26: "P_SaveProjectTaskNew",
  27: "P_UpdateProjectNew",
  28: "P_DeleteAttendance",
  29: "P_DeleteDiscussion",
  30: "P_SaveSalutation",
  31: "P_UpdateSalutation",
  32: "P_GetSalutation",
  33: "P_SavePriorityOrder",
  34: "P_GetPriorityOrder",
  35: "P_UpdatePriorityOrder",
  36: "P_UpdateOrganisation",
  37: "P_GetRole",
  38: "P_SaveModule",
  39: "P_GetModule",
  40: "P_UpdateModule",
  41: "P_GetDiscussion",
  42: "P_InsertTask",
  43: "P_UpdateTask",
  44: "P_GetDiscussionPointsFiltered",
  45: "P_GetMeetingDisCussionAttendanceDetails",
  46: "P_GetDashboardCounts",
  50: "P_SaveAttendance",
};

const outputSPs = [
  "P_InsertUser",
  "P_InsertTask",
  "P_DeleteDiscussion",
  "P_UpdateUser",
  "P_SaveDesignation",
  "P_UpdateDesignation",
  "P_SaveDivision",
  "P_SaveOrganisation",
  "P_SaveEmployement",
  "P_SaveMeeting",
  "P_SaveStatus",
  "P_UpdateStatus",
  "P_SaveProjectTaskNew",
  "P_SaveSalutation",
  "P_SavePriorityOrder",
  "P_SaveModule",
];

const defaultMessages = {
  1: "Users fetched successfully",
  2: "User inserted successfully",
  3: "User updated successfully",
  4: "Designations fetched successfully",
  5: "Designation saved successfully",
  6: "Designation updated successfully",
  7: "Divisions fetched successfully",
  8: "Division saved successfully",
  9: "Division updated successfully",
  10: "Organisations fetched successfully",
  11: "Organisation saved successfully",
  12: "Employement types fetched successfully",
  13: "Employement saved successfully",
  14: "Employement updated successfully",
  15: "Meetings fetched successfully",
  16: "Meeting saved successfully",
  17: "Discussion point saved successfully",
  18: "Discussion point updated successfully",
  19: "Status saved successfully",
  20: "User logging in successfully",
  21: "Status updated successfully",
  22: "Statuses fetched successfully",
  23: "Meeting updated successfully",
  24: "Attendance updated successfully",
  25: "Projects fetched successfully",
  26: "Project saved successfully",
  27: "Project updated successfully",
  28: "Attendance deleted successfully",
  29: "Discussion point deleted successfully",
  30: "Salutation saved successfully",
  31: "Salutation updated successfully",
  32: "Salutations fetched successfully",
  33: "Priority title saved successfully",
  34: "Priority orders fetched successfully",
  35: "Priority order updated successfully",
  36: "Organisation updated successfully",
  37: "Roles fetched successfully",
  38: "Module Save Successfully.",
  39: "Modules fetched successfully",
  40: "Module updated successfully",
  41: "Discussion points fetched successfully",
  42: "Task inserted successfully",
  43: "Task updated successfully",
  44: "Tasks fetched successfully",
  45: "Meeting discussion attendance details fetched successfully",
  46: "Dashboard counts fetched successfully",
  50: "Attendance saved successfully",
};

router.post("/api", async (req, res) => {
  let { Key, CustomMessage, ...params } = req.body;

  if (!Key || isNaN(parseInt(Key))) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Missing or invalid Key parameter',
    });
  }

  Key = parseInt(Key);
  const procedureName = spMap[Key];

  if (!procedureName) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Bad Request: Please check the input parameters and ensure the request is properly formatted.",
    });
  }

  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Database connection not established.",
      });
    }

    const request = pool.request();  // Create a new request for each API call to ensure thread safety

    // Bind input parameters
    for (const param in params) {
      const value = params[param];
      if (typeof value === "number") {
        request.input(param, sql.Int, value);
      } else if (
        param.toLowerCase().includes("date") ||
        param.toLowerCase().includes("time")
      ) {
        request.input(param, sql.DateTime, new Date(value));
      } else {
        request.input(param, sql.NVarChar(sql.MAX), value?.toString());
      }
    }

    // Output handling
    if (outputSPs.includes(procedureName)) {
      // Generic output message
      request.output("OutputMessage", sql.VarChar(255));

      // Specific output parameter for P_SaveMeeting
      if (procedureName === "P_SaveMeeting") {
        request.output("MeetingId", sql.Int);
      }
    }

    const result = await request.execute(procedureName);
    const outputMessage = result.output?.OutputMessage;

    // "Already exists" handling
    if (
      outputMessage &&
      outputMessage.toLowerCase().includes("already exists")
    ) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: outputMessage || "Entity already exists.",
      });
    }

    // Construct response
    const response = {
      success: true,
      status: 200,
      message:
        CustomMessage ||
        outputMessage ||
        defaultMessages[Key] ||
        "Operation completed",
    };

    // Add returned data
    if (result.recordset?.length > 0) {
      response.data = result.recordset;
    }

    // Include output parameters
    if (result.output) {
      response.output = result.output;
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error(`Error executing ${procedureName}:`, err.message);
    return res.status(500).json({
      success: false,
      status: 500,
      message: `Something went wrong while executing ${procedureName}`,
      error: err.message,
    });
  }
});

module.exports = router;
