
export const Timer = (props : {timeLeft: number}) => {
  const {timeLeft} = props;
  return (
    <div>
      <h2>Time Left: {timeLeft}s</h2>
    </div>
  )
}
