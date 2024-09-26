import QuestionCard from '../components/QuestionCard';
import DefaultLayout from '../layout/DefaultLayout';

export const faqData = [
  {
    question: 'What is Campus Vault?',
    answer:
      'Campus Vault is your ultimate resource for managing and enhancing your University experience.',
  },
  {
    question: 'Why do we use it?',
    answer:
      'With Campus Vault, you can easily check your grades and averages, print them, view your schedule, and communicate seamlessly with your institution.',
  },
  {
    question: 'What makes it unique?',
    answer:
      'Unlike other services, Campus Vault is designed to be highly efficient, user-friendly, and easy to use.',
  },
  {
    question: 'Does it come with a cost?',
    answer:
      'No! Campus Vault is completely free for all students and teachers.',
  },
];

const Faq = () => {
  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-3xl font-bold mb-8 text-center text-dark-primary dark:text-light-primary">
          Asked by YOU, answered by US!
        </p>

        {faqData.map((faq, index) => (
          <QuestionCard
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}

        <p className="mt-10 text-center">
          If we missed anything, please{' '}
          <a href="mailto:example@secretary.com" className="text-light-blue">
            ask us here
          </a>
          .
        </p>
      </div>
    </DefaultLayout>
  );
};

export default Faq;
