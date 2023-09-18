import { useEffect, useState } from 'react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { uniqueCards } from './constant';
import ConfettiExplosion from 'react-confetti-explosion';
import './App.css'

const App = () => {
  const [cardList, setCardList] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disableDeck, setDisableDeck] = useState(false);

  const shuffleCards = (list) => {
    const length = list.length;
    for (let i = length; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      const temp = list[currentIndex];
      list[currentIndex] = list[randomIndex];
      list[randomIndex] = temp;
    }
    setCardList(list)
  }

  const matchCards = () => {
    const [first, second] = openCards;
    if (cardList[first].img !== cardList[second].img) {
      setTimeout(() => {
        setDisableDeck(false);
        setOpenCards([]);
        setClearedCards(clearedCards?.filter((id) => {
          if (!openCards?.includes(id)) return id;
        }))
      }, 800)
    } else {
      setOpenCards([]);
      if(clearedCards?.length === cardList?.length){
        setTimeout(() => {
          setShowConfetti(true);
        }, 300)
      }
    }
  }

  const handleClickOnCard = (index) => {
    if (openCards?.includes(index) || clearedCards?.includes(index)) return;
    if (openCards?.length <= 1) {
      setOpenCards(prev => ([...prev, index]));
      setClearedCards(prev => ([...prev, index]))
    } else {
      setOpenCards([]);
    }
  }

  useEffect(() => {
    if (openCards?.length === 2) {
      setDisableDeck(true);
      matchCards();
    }
  }, [openCards])

  useEffect(() => {
    if (uniqueCards?.length)
      shuffleCards([...uniqueCards, ...uniqueCards])
  }, [])

  return (
    <div className='card-container' >
      <div style={{ position: 'absolute', top: '50%',left: '50%', transform: 'translate(-50%, -50%)'  }} >
        { true && <ConfettiExplosion { ...{force: 0.5,duration: 3000,particleCount: 300,width: 2000}} />}
      </div>
      <div className='cards' >
        {cardList.map(({ img }, index) => <div key={index} className={`card ${clearedCards?.includes(index) && 'is-flipped'}`} onClick={() => handleClickOnCard(index)} >
            <QuestionMarkIcon className='view' fontSize='large' style={{ color: '#193A81' }} />
            <img className='view back-view' width={100} height={100} src={img} alt="" />
        </div>)}
      </div>
    </div>
  )
}

export default App
