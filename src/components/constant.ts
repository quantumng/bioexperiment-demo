export const enum Step {
    One,
    Two,
    Three,
    Four,
    Five,
}


const questionList1 = {
    [Step.Three]: {
        question: '若样品中含有黄曲霉毒素B1，T线是否显色？',
        options: [ '显色', '不显色' ],
        answer: false
    },
    [Step.Four]: {
        question: '若样品中含有黄曲霉毒素B1，C线是否显色？',
        options: [ '显色', '不显色' ],
        answer: true
    },
}

const questionList2 = {
    [Step.Three]:         {
        question: '若样品中不含黄曲霉毒素B1，T线是否显色？',
        options: [ '显色', '不显色' ],
        answer: true
    },

    [Step.Four]: {
        question: '若样品中不含黄曲霉毒素B1，C线是否显色？',
        options: [ '显色', '不显色' ],
        answer: true
    },
}
export const getQuestion = (step: number, hasB1: boolean) => {
    // @ts-ignore
    return hasB1 ? questionList1[step] : questionList2[step];
}