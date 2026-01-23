import { useState } from 'react';
import type { QuizQuestion } from '../../types/course';

interface QuizSectionProps {
  quizData: QuizQuestion[];
}

const QuizSection = ({ quizData }: QuizSectionProps) => {
  // 状态：记录用户的选择 { 题目索引: 选项索引 index }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  // 状态：是否已提交
  const [isSubmitted, setIsSubmitted] = useState(false);
  // 状态：当前分数
  const [score, setScore] = useState(0);

  // 处理选项变更 (存入的是选项的 index)
  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return; 
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  // 处理提交
  const handleSubmit = () => {
    let currentScore = 0;
    
    quizData.forEach((quiz, index) => {
      //使用 db 里的 correctAnswerIndex 字段进行比对
      if (userAnswers[index] === quiz.correctAnswerIndex) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  // 辅助函数：获取选项的样式
  const getOptionStyle = (quiz: QuizQuestion, index: number, optIdx: number): string => {
    const isSelected = userAnswers[index] === optIdx;
    
    // 判断当前选项是否是正确答案
    const isCorrect = optIdx === quiz.correctAnswerIndex;

    let baseStyle = "flex items-center p-3 border rounded-lg cursor-pointer transition-colors ";

    // 1. 未提交状态
    if (!isSubmitted) {
      return baseStyle + (isSelected 
        ? "border-violet-600 bg-violet-50" 
        : "border-slate-200 hover:bg-slate-50");
    }

    // 已提交状态
    if (isCorrect) {
      // 无论你选没选，正确答案都显示绿色
      return baseStyle + "border-green-500 bg-green-50";
    }
    if (isSelected && !isCorrect) {
      // 选错的项：显示红色
      return baseStyle + "border-red-500 bg-red-50";
    }
    
    // 其他无关选项：变淡
    return baseStyle + "border-slate-200 opacity-50";
  };

  return (
    <div className="space-y-8 mt-2">
      {quizData.map((quiz, i) => (
        <div key={i} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <p className="font-semibold text-slate-900 mb-4 text-lg">
            {i + 1}. {quiz.question}
          </p>
          
          <div className="space-y-3">
            {quiz.options && quiz.options.map((option, optIdx) => (
              <label 
                key={optIdx} 
                className={getOptionStyle(quiz, i, optIdx)}
              >
                <input 
                  type="radio" 
                  name={`quiz-${i}`} // 确保每道题的 radio group 独立
                  value={optIdx} 
                  checked={userAnswers[i] === optIdx} 
                  onChange={() => handleOptionChange(i, optIdx)} 
                  disabled={isSubmitted} // 提交后禁用
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <span className={`ml-3 ${isSubmitted && optIdx === quiz.correctAnswerIndex ? "font-bold text-green-700" : "text-slate-700"}`}>
                  {option}
                </span>
                
                {/* --- 结果反馈图标 --- */}
                {/* 情况1：已提交 且 这个选项是正确答案 */}
                {isSubmitted && optIdx === quiz.correctAnswerIndex && (
                  <span className="ml-auto text-green-600 font-bold text-sm">✓ Correct</span>
                )}
                
                {/* 情况2：已提交 且 我选了这个 且 这个不是正确答案 */}
                {isSubmitted && userAnswers[i] === optIdx && optIdx !== quiz.correctAnswerIndex && (
                   <span className="ml-auto text-red-600 font-bold text-sm">✗ Your Answer</span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* 底部操作区 */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Submit Answers
          </button>
        ) : (
          <div className="flex items-center gap-4 animate-fade-in">
             <div className="text-xl font-bold text-slate-900">
               Score: <span className={score === quizData.length ? "text-green-600" : "text-violet-600"}>{score}</span> / {quizData.length}
             </div>
             {score === quizData.length && (
               <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Perfect! 🎉</span>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
