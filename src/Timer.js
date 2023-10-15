import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPlay,
  faPause,
  faRepeat
} from "@fortawesome/free-solid-svg-icons";

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const formattedSeconds = String(seconds).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  const handlePlay = () => {
    const breakAudio = document.getElementById("beep");
    const playPromise = breakAudio.play();

    if (playPromise !== undefined) {
      playPromise.then((_) => {}).catch((error) => {});
    }
  };

  const handlePause = () => {
    const breakAudio = document.getElementById("beep");
    breakAudio.pause();
    breakAudio.currentTime = 0;
  };

  const handleSessionLabel = () => {
    if (isBreak) {
      return "Break";
    }
    return "Session";
  };

  const handleReset = () => {
    setSeconds(0);
    setMinutes(25);
    setSessionLength(25);
    setBreakLength(5);
    setIsActive(false);
    setIsBreak(false);
    handlePause();
  };

  const handleIncrement = (event) => {
    const buttonId = event.currentTarget.id;

    if (isActive || isBreak) {
      return;
    }

    if (buttonId === "break-increment" && breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
    if (buttonId === "session-increment" && sessionLength < 60) {
      setMinutes(minutes + 1);
      setSessionLength(sessionLength + 1);
    }
  };

  const handleDecrement = (event) => {
    const buttonId = event.currentTarget.id;

    if (isActive || isBreak) {
      return;
    }

    if (buttonId === "break-decrement" && breakLength > 1) {
      setBreakLength(breakLength - 1);
    } else if (buttonId === "session-decrement" && minutes > 1) {
      setMinutes(minutes - 1);
      setSessionLength(sessionLength - 1);
    }
  };

  useEffect(() => {
    let interval = null;

    if (seconds <= 0 && minutes <= 0) {
      handlePause();
      handlePlay();
    }

    if (isActive) {
      interval = setInterval(() => {
        // Switches to Break mode when time is 00:00

        if (seconds <= 0 && minutes <= 0 && !isBreak) {
          setSeconds(0);
          setMinutes(breakLength);
          setIsBreak(true);

          return;
        }

        // Switches to Session mode when time is 00:00
        if (seconds <= 0 && minutes <= 0 && isBreak) {
          setSeconds(0);
          setMinutes(sessionLength);
          setIsBreak(false);

          return;
        }

        // Checks if seconds ticks to zero, counts down 1 minute
        if (seconds <= 0) {
          setSeconds(59);
          setMinutes((minutes) => minutes - 1);
        } else {
          setSeconds((seconds) => seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreak, isActive, breakLength, sessionLength, seconds, minutes]);

  return (
    <>
      <div id="container">
        <div id="app">
          <div>
            <div className="main-title">Pomodoro Clock</div>
            <div className="length-control">
              <div id="break-label">Break Length</div>
              <button
                className="btn-level"
                id="break-decrement"
                value="-"
                onClick={handleDecrement}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </button>
              <div className="btn-level" id="break-length" value="+">
                {breakLength}
              </div>
              <button
                className="btn-level"
                id="break-increment"
                value="+"
                onClick={handleIncrement}
              >
                <FontAwesomeIcon icon={faAngleUp} />
              </button>
            </div>
            <div className="length-control">
              <div id="session-label">Session Length</div>
              <button
                className="btn-level"
                id="session-decrement"
                value="-"
                onClick={handleDecrement}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </button>
              <div className="btn-level" id="session-length" value="+">
                {sessionLength}
              </div>
              <button
                className="btn-level"
                id="session-increment"
                value="+"
                onClick={handleIncrement}
              >
                <FontAwesomeIcon icon={faAngleUp} />
              </button>
            </div>
            <div className="timer">
              <div className="timer-wrapper">
                <div id="timer-label">{handleSessionLabel()}</div>
                <audio
                  id="beep"
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3"
                  preload="auto"
                />
                <div id="time-left">
                  {formattedMinutes}:{formattedSeconds}
                </div>
              </div>
            </div>
            <div className="timer-control">
              <button id="start_stop" onClick={() => setIsActive(!isActive)}>
                {isActive ? (
                  <i className="pause">
                    <FontAwesomeIcon icon={faPause} />
                  </i>
                ) : (
                  <i className="play">
                    <FontAwesomeIcon icon={faPlay} />
                  </i>
                )}
              </button>
              <button id="reset" onClick={handleReset}>
                <i className="reset" id="resetIt">
                  <FontAwesomeIcon icon={faRepeat} />
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
