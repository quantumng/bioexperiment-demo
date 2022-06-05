import { FC } from 'react';

const questionList = [
    {
        question: '若样品中含有黄曲霉毒素B1，T线是否显色？',
        options: [
            { value: 'A', label: '显色' },
            { value: 'B', label: '不显色' },
        ],
        answer: 'B'
    },
    {
        question: '若样品中含有黄曲霉毒素B1，C线是否显色？',
        options: [
            { value: 'A', label: '显色' },
            { value: 'B', label: '不显色' },
        ],
        answer: 'A'
    },
    {
        question: '若样品中不含黄曲霉毒素B1，T线是否显色？',
        options: [
            { value: 'A', label: '显色' },
            { value: 'B', label: '不显色' },
        ],
        answer: 'A'
    },
    {
        question: '若样品中不含黄曲霉毒素B1，C线是否显色？',
        options: [
            { value: 'A', label: '显色' },
            { value: 'B', label: '不显色' },
        ],
        answer: 'A'
    },
]

const Question: FC = (props) => {


    return <div>Question</div>
};

export default Question;