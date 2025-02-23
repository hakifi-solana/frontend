"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/Animation.module.scss";
import clsx from "clsx";

const AnimationText = ({ contents }: { contents: string[][] }) => {
	const [currentLineIndex, setCurrentLineIndex] = useState(0);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentWordIndex((prevWordIndex) => {
				const nextWordIndex =
					(prevWordIndex + 1) % contents[currentLineIndex].length;

				if (nextWordIndex === 0) {
					setCurrentLineIndex(
						(prevLineIndex) => (prevLineIndex + 1) % contents.length
					);

					if (currentLineIndex === contents.length - 1) {
						setCurrentLineIndex(0);
					}
				}

				return nextWordIndex;
			});
		}, 2500);

		return () => clearInterval(intervalId);
	}, [currentLineIndex, setCurrentWordIndex]);
	return (
		<div
			className={clsx(
				"text-support-white h-max md:display-1-desktop display-1-mobile font-medium md:max-w-[428px] w-full",
				styles.textAnimation
			)}
		>
			{contents.map((line, lineIndex) => (
				<div
					key={lineIndex}
					style={{ display: lineIndex === currentLineIndex ? "grid" : "none" }}
					className="w-full grid-rows-2 gap-y-2"
				>
					{line.map((word, wordIndex) => (
						<div
							style={{
								backgroundImage: "url(/assets/images/home/bg_text_banner.png)",
							}}
							className="bg-no-repeat bg-center h-full p-4 text-center relative w-full"
							key={`${word}-${wordIndex}`}
						>
							<p
								className={clsx(
									"text-support-white w-full h-full text-center font-determination",
									{
										"animate-opacity":
											lineIndex === currentLineIndex &&
											wordIndex === currentWordIndex,
									}
								)}
							>
								{word}
							</p>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default AnimationText;
