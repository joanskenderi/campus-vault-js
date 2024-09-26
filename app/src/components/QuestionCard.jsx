import FloatingCard from '../ui/FloatingCard';

const QuestionCard = ({ question, answer }) => {
  return (
    <FloatingCard title={question}>
      <div className="pb-6">{answer}</div>
    </FloatingCard>
  );
};

export default QuestionCard;
