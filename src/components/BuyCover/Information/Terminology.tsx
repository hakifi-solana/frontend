import Modal from '@/components/common/Modal';
import { Separator } from '@/components/common/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import Tag from '@/components/common/Tag';
import { GLOSSARY_MODE, STATUS_DEFINITIONS } from '@/utils/constant';
import { Fragment, useMemo } from 'react';

type TerminologyProps = {
    isOpen: boolean;
    handleToggle: () => void;
};

const Terminology = ({ handleToggle, isOpen }: TerminologyProps) => {
    const state = useMemo(() => Object.keys(STATUS_DEFINITIONS), []);

    return (
        <Modal
            isOpen={isOpen}
            isMobileFullHeight
            onRequestClose={handleToggle}
            showCloseButton={true}
            className="text-primary-3"
            contentClassName="sm:min-w-[610px] max-h-[700px]"
            title="Terms and Definition"
            modal={true}
        >
            <section className="flex flex-col justify-start items-center">
                <Tabs
                    defaultValue={GLOSSARY_MODE.TERMINOLOGY}
                    className="w-full"
                    activationMode="automatic">
                    <TabsList className="grid w-[300px] grid-cols-2 gap-5">
                        <TabsTrigger
                            value={GLOSSARY_MODE.TERMINOLOGY}
                            className=
                            "text-tab-14 data-[state=active]:text-typo-accent data-[state=inactive]:text-typo-secondary data-[state=active]:border-typo-accent data-[state=inactive]:border-transparent border-b-2 w-fit pb-4"
                        >
                            Insurance terms
                        </TabsTrigger>
                        <TabsTrigger
                            value={GLOSSARY_MODE.STATUS}
                            className=
                            "text-tab-14 data-[state=active]:text-typo-accent data-[state=inactive]:text-typo-secondary data-[state=active]:border-typo-accent data-[state=inactive]:border-transparent border-b-2 w-fit pb-4"
                        >
                            Contract status
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={GLOSSARY_MODE.TERMINOLOGY} className="text-left overflow-y-auto custom-scroll max-h-[450px]">
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                Q-Covered
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Quantity of covered asset
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                P-Market
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                The current price of the covered asset
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                P-Claim
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Price activates cover payout
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                P-Expired
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Price triggers the insurance contract to expire
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                P-Refund
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Price is within the margin refund terms
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                Period
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Period of the insurance contract
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                R-Claim
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Ratio of cover payout to Margin
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                Q-Claim
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Price activates cover payout
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                Margin
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Margin of insurance contract
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                Q-Refund
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Quantity of covered asset refunded to user
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                T-Claim
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Time the user receives cover payments
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                T-Record
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Time to record cover hitting P-Expire
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                T-Start
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Time to start cover
                            </div>
                        </div>
                        <Separator />
                        <div className="py-4 flex items-center justify-start text-body-14">
                            <div className="flex-1 text-typo-primary">
                                T-Expire
                            </div>
                            <div className="flex-2 text-typo-secondary">
                                Time to end cover
                            </div>
                        </div>
                        {/* <div className="py-3 flex items-center text-body-14">
                            <div className="flex-1 text-primary-3 ">
                                {t('terminology.refund_amount')}
                            </div>
                            <div className="flex-[2] text-grey-1">
                                {t('terminology.refund_amount_des')}
                            </div>
                        </div>
                        <Separator /> */}
                    </TabsContent>
                    <TabsContent value={GLOSSARY_MODE.STATUS} className="text-left overflow-y-scroll custom-scroll max-h-[450px]">
                        <Separator className="mt-3" />
                        {
                            state.map((item, index) => {
                                const { variant, title, description } = STATUS_DEFINITIONS[item];
                                return <Fragment key={`${item}-${index}`}>
                                    <div className="py-3 flex items-center text-body-14 gap-4">
                                        <div className="flex-1">
                                            <Tag
                                                variant={variant}
                                                text={title}
                                            />
                                        </div>
                                        <div className="flex-2 text-typo-secondary">
                                            {description}
                                        </div>
                                    </div>
                                    <Separator />
                                </Fragment>;
                            })
                        }
                    </TabsContent>
                </Tabs>
            </section>
        </Modal>
    );
};

export default Terminology;