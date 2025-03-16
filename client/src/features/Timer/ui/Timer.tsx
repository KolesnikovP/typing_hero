
export const Timer = (props : {timeLeft: number}) => {
  const {timeLeft} = props;
  return (
    <div>
      <h2>Time Left: {timeLeft}</h2>
    </div>
  )
}
