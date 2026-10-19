import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function renderTime(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysValue.textContent = String(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function updateTimer() {
  if (!userSelectedDate) {
    return;
  }

  const timeDifference = userSelectedDate.getTime() - Date.now();

  if (timeDifference <= 0) {
    renderTime(0);
    clearInterval(timerId);
    timerId = null;
    dateInput.disabled = false;
    startButton.disabled = true;
    userSelectedDate = null;
    return;
  }

  renderTime(timeDifference);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate) {
      userSelectedDate = null;
      startButton.disabled = true;
      return;
    }

    if (selectedDate <= new Date()) {
      userSelectedDate = null;
      startButton.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

startButton.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  if (timerId) {
    clearInterval(timerId);
  }

  startButton.disabled = true;
  dateInput.disabled = true;

  updateTimer();
  timerId = setInterval(updateTimer, 1000);
});

renderTime(0);
