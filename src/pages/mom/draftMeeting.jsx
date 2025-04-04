import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { meetingsActions } from '../../store/mom/momSlice';
import { Link } from 'react-router-dom';
import moment from 'moment';

const DraftMeeting = ({ handleEditMeeting, handleNewMeeting }) => {
  const dispatch = useDispatch();
  const [draftMeetings, setDraftMeetings] = useState(null);
  const MeetingLists = useSelector((state) => state.meetings.data);

  useEffect(() => {
    dispatch(meetingsActions.getMeetingsInfo());
  }, []);

  useEffect(() => {
    setDraftMeetings(MeetingLists?.MeetingDetails?.filter((item) => item.Draft < 4));
  }, [MeetingLists]);

  return (
    <div>
      <Row>
        <Col>
          <h5 className="mb-3 theme-color">Draft Meetings</h5>
        </Col>
      </Row>
      <Row>
        {draftMeetings?.map((item, idx) => (
          <Col md={3} key={`${idx}-${idx}-${Math.random()}`}>
            <div className="card project-task ">
              <div className="card-body">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <Link>
                      <h5 className="m-0 pointer text-success" onClick={() => handleEditMeeting(item)}>
                        <i className="far fa-edit m-r-10"></i>Meeting
                      </h5>
                    </Link>
                  </div>
                  <div className="col-auto">
                    <label className="badge theme-bg2 text-white f-14 f-w-400 float-end">{(item.Draft / 4) * 100}% Done</label>
                  </div>
                </div>
                <h6 className="mt-3 mb-3">
                  Steps Complete: <span className="text-muted">{item.Draft}/4</span>
                </h6>
                <div className="progress">
                  <div
                    className="progress-bar progress-c-theme"
                    role="progressbar"
                    style={{ width: `${(item.Draft / 4) * 100}%`, height: '6px' }}
                    aria-valuenow="60"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <h6 className="mt-3 mb-0">
                  Title : <span className="text-muted">{item.MeetingTitle}</span>
                </h6>
                <h6 className="mt-3 mb-0">
                  Date : <span className="text-muted">{moment(item.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}</span>
                </h6>
                <h6 className="mt-3 mb-0 ">
                  Time : <span className="text-muted">{moment(item.MeetingTime, 'HH:mm:ss.SSSSSSS').format('hh:mm A')}</span>
                </h6>
              </div>
            </div>
          </Col>
        ))}
        <Col md={3} key={`${Math.random()}`}>
          <div className="card project-task " onClick={handleNewMeeting}>
            <div className="card-body d-flex justify-content-center align-items-center">
              <span className="fas fa-plus addMeeting"></span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DraftMeeting;
