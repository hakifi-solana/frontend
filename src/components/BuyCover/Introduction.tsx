"use client";

import useTicker from '@/hooks/useTicker';
import useAppStore from '@/stores/app.store';
import { formatNumber } from '@/utils/format';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Guideline = dynamic(() => import('@/components/BuyCover/Guideline'), { ssr: false });

const Introduction = () => {
    const [startGuide, setStartGuide] = useState(false);
    const [startOnboard, setStartOnboard] = useAppStore(state => [state.startOnboard, state.setStartOnboard]);
    const { symbol } = useParams();

    const ticker = useTicker(symbol as string);
    const value: number = Number(ticker?.lastPrice) ?? 0;

    const title = useMemo(() => `${formatNumber(value)} | ${(symbol as string).substring(0, symbol.indexOf(symbol.slice(-4).toString()))}/${symbol.slice(-4)} | Hakifi insurance`, [value, symbol]);

    useEffect(() => {
        setStartGuide(startOnboard);
    }, [startOnboard]);

    useEffect(() => {
        if (!startGuide) setStartOnboard(false);
    }, [startGuide]);

    // Check to remind user
    // const onCheckRemind = debounce(async (checked: boolean) => {

    // }, 500);

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {/* <GlossaryModal visible={showModal} onClose={() => setShowModal(false)} /> */}
            {/* <Modal
                isOpen={showIntro}
                className={clsx({
                    'max-h-full h-full': isMobile,
                    '!w-[30rem] !max-h-[calc(100vh-9rem)]': !isMobile,
                })}
                onRequestClose={onClose}
                title=""
            >
                <Background>
                    <div className="w-full">
                        <img alt="Nami insurance" src="/images/screens/insurance/intro.png" className="max-w-[177px] m-auto" />
                    </div>
                </Background>
                <div className="">
                    <div className="text-center">
                        <div className="mt-4 text-xl sm:text-2xl font-semibold">Nami Insurance</div>
                        <div className="mt-2">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: t('insurance:intro:intro_description', {
                                        start_btn: `<span class="italic">${t('insurance:intro:start_btn')}</span>`,
                                    }),
                                }}
                            ></span>
                        </div>
                    </div>
                </div>
                <CheckBox className="mt-8" title={t('insurance:intro:remind_later')} onChange={onCheckRemind} />
                <div className="mt-6 mb-3">
                    <Button onClick={onClick} variant="primary" className="w-full py-3">
                        {t('insurance:intro:start_btn')}
                    </Button>
                </div>
                <div className="text-center">
                    <span onClick={() => setShowModal(true)} className="text-center cursor-pointer text-red" color="red">
                        {t('insurance:guild:the_glossary')}
                    </span>
                </div>
            </Modal> */}
            <Guideline start={startGuide} setStart={setStartGuide}  />
        </>
    );
};

export default Introduction;
