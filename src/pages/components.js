import { Button } from "@/components/ui/button";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { GoArrowDown, GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { GrTransaction } from "react-icons/gr";

export default function Components() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className={`container mx-auto px-4 py-8`}>
      <div className="flex justify-center mb-4 mt-6 mb-6">
        <h1 className="text-3xl font-bold">Components page</h1>
      </div>
      <div className="bg-white py-10 sm:py-32 text-newPrimary rounded-xl">
        {/* ====== Layout ======= */}
        <div className="mb-10">
          <h1 className="text-xl font-bold pl-4">Layout</h1>
          <div className="items-center mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-b border-gray-200 py-10 lg:mx-0 lg:max-w-none px-3">
            <div className="min-h-screen bg-gradient-custom px-10 pt-10">
              <div className="md:container md:px-36"></div>
            </div>
          </div>
        </div>
        {/* ====== Layout ======= */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* ====== Buttons ======= */}
          <div className="mb-10">
            <h1 className="text-xl font-bold border-t pt-10">Buttons</h1>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-b border-gray-200 py-10 sm:py-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <Button className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full w-48 hover:scale-[1.1]">
                Button
              </Button>
              <Button className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full w-48 hover:scale-[1.1]">
                Challenge
              </Button>
              <Button className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full w-48 hover:scale-[1.1]">
                Next
              </Button>
              <Button className="w-12 h-12 flex items-center justify-center bg-newSecondary border border-tertiary rounded-full text-tertiary hover:bg-newSecondary hover:scale-[1.1]">
                <p>
                  <RiLogoutCircleRLine className="text-[24px] text-dark hover:scale-[1.1]" />
                </p>
              </Button>
              <Button className="w-2 h-8 md:w-12 md:h-12 px-3 flex items-center justify-center bg-newSecondary border border-tertiary rounded-full text-tertiary hover:bg-newSecondary hover:scale-[1.1] md:mx-3">
                <p>
                  <GrTransaction className="text-[16px] md:text-[24px] text-dark hover:scale-[1.1]" />
                </p>
              </Button>
            </div>
          </div>
          {/* ====== Buttons ======= */}

          {/* ====== Images ======= */}
          <div className="mb-10">
            <h1 className="text-xl font-bold">Images</h1>
            <div className="items-center mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-b border-gray-200 py-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <div className="flex-shrink-0 w-[105px] h-[106px] bg-gray-300 rounded-lg overflow-hidden">
                <img
                  src="/user.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-shrink-0 w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                <img
                  src="/user.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-shrink-0 w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                <img
                  src="/user.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
          {/* ====== Images ======= */}

          {/* ====== Cards ======= */}
          <div className="mb-10">
            <h1 className="text-xl font-bold">Cards</h1>
            <div className="items-center mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-b border-gray-200 py-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {/*-------------------------------- First Card -------------------------------------*/}
              <div className="w-[134px] h-[141px] min-w-[134px] min-h-[141px] bg-tertiary shadow-md rounded-[25px] p-4 flex flex-col justify-center items-center"></div>
              {/*-------------------------------- First Card -------------------------------------*/}

              {/*-------------------------------- Second Card -------------------------------------*/}
              <div className="w-[134px] h-[141px] min-w-[134px] min-h-[141px] bg-tertiary shadow-md rounded-[25px] p-4 flex flex-col justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary">clmns</p>
                </div>
              </div>
              {/*-------------------------------- Second Card -------------------------------------*/}

              {/*-------------------------------- Third Card -------------------------------------*/}
              <div className="min-h-[160px] bg-tertiary shadow-md rounded-[25px] p-4 flex flex-col justify-center items-center"></div>
              {/*-------------------------------- Third Card -------------------------------------*/}

              {/*-------------------------------- Fourth Card -------------------------------------*/}
              {/* <div className="min-h-[160px] bg-tertiary shadow-md rounded-[25px] px-4 flex flex-row justify-between items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary">clmns</p>

                  <div className="flex space-x-2 mt-1">
                    <div className="w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                      <img
                        src="/user.png"
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                      <img
                        src="/user.png"
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center mx-4 flex-grow text-center">
                  <p className="text-[24px] font-bold text-white">FIFA</p>
                  <p className="text-[24px] font-bold text-newSecondary">vs</p>
                  <p className="text-[36px] font-bold text-newSecondary">50$</p>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary">lionesquex</p>

                  <div className="text-start flex justify-start space-x-2 mt-1">
                    <div className="w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                      <img
                        src="/user.png"
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="min-h-[160px] sm:min-w-[356px] py-3 bg-tertiary shadow-md rounded-[25px] px-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary font-bold">
                    clmns
                  </p>

                  <div className="flex space-x-2 mt-1">
                    <div className="w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                      <img
                        src="/user.png"
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                      <img
                        src="/user.png"
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center mx-4 flex-grow text-center">
                  <p className="text-[24px] font-bold text-white">FIFA</p>
                  <p className="text-[24px] font-bold text-newSecondary">vs</p>
                  <p className="text-[36px] font-bold text-newSecondary">50$</p>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary font-bold">
                    lionesquex
                  </p>

                  <div className="text-start flex justify-start space-x-2 mt-1">
                    <div className="w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                      <img
                        src="/user.png"
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/*-------------------------------- Fourth Card -------------------------------------*/}

              {/*-------------------------------- Fifth Card -------------------------------------*/}
              {/* <div className="min-w-[356px] min-h-[160px] bg-tertiary shadow-md rounded-[25px] px-4 flex flex-row justify-between items-center">
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-[24px] font-bold text-white">FIFA</p>
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary">clmns</p>
                </div>

                <div className="flex flex-col items-center mx-4 flex-grow text-center">
                  <p className="text-[36px] font-bold text-newSecondary">5$</p>
                </div>

                <div className="flex flex-col items-bottom space-y-2">
                  <p className="text-[24px] font-bold text-white"></p>
                  <svg
                    width="43"
                    height="70"
                    viewBox="0 0 43 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.25 41L24.375 5V29H38.75L18.625 65V41H4.25Z"
                      stroke="#0356CC"
                      stroke-width="8.33333"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div> */}

              {/*-------------------------------- Fifth Card -------------------------------------*/}

              {/*-------------------------------- Sixth Card -------------------------------------*/}
              {/* <div className="min-w-[356px] min-h-[160px] bg-tertiary shadow-md rounded-[25px] px-4 flex flex-row justify-between items-center">
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-[24px] font-bold text-white">FIFA</p>
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary">clmns</p>
                </div>

                <div className="flex flex-col items-center mx-4 flex-grow text-center">
                  <p className="text-[36px] font-bold text-newSecondary">5$</p>
                </div>

                <div className="flex items-center justify-center flex-col items-bottom space-y-1">
                  <p className="text-[24px] font-bold text-white"></p>
                  <svg
                    width="43"
                    height="70"
                    viewBox="0 0 43 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.25 41L24.375 5V29H38.75L18.625 65V41H4.25Z"
                      stroke="#0356CC"
                      stroke-width="8.33333"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p className="text-[13px] text-newSecondary">
                    arina.xyz/dferxf5
                  </p>
                  <Button className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full text-[13px] hover:scale-[1.1]">
                    Copy Invitation
                  </Button>
                </div>
              </div> */}
              {/*-------------------------------- Sixth Card -------------------------------------*/}

              {/*-------------------------------- Seventh Card -------------------------------------*/}
              {/* <div className="min-w-[356px] min-h-[160px] bg-tertiary shadow-md rounded-[25px] px-4 flex flex-row justify-between">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary">clmns</p>
                </div>

                <div className="flex flex-col items-center justify-start mx-4 flex-grow text-center">
                  <p className="text-[24px] font-bold text-white">FIFA</p>
                  <p className="text-[36px] font-bold text-newSecondary">5$</p>
                </div>

                <div className="flex items-center justify-center flex-col items-bottom space-y-1">
                  <p className="text-[24px] font-bold text-white"></p>
                  <svg
                    width="43"
                    height="70"
                    viewBox="0 0 43 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.25 41L24.375 5V29H38.75L18.625 65V41H4.25Z"
                      stroke="#0356CC"
                      stroke-width="8.33333"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p className="text-[13px] text-newSecondary">
                    arina.xyz/dferxf5
                  </p>
                  <Button className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full text-[13px] hover:scale-[1.1]">
                    Copy Invitation
                  </Button>
                </div>
              </div> */}
              {/*-------------------------------- Seventh Card -------------------------------------*/}

              {/*-------------------------------- Eighth Card -------------------------------------*/}
              {/* <div className="min-w-[356px] min-h-[160px] bg-tertiary shadow-md rounded-[25px] px-4 flex flex-row justify-between items-center">
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-[24px] font-bold text-white">FIFA</p>
                  <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src="/user.png"
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary">clmns</p>
                </div>

                <div className="flex flex-col items-center justify-end mx-4 flex-grow">
                  <p className="text-[24px] font-bold text-newSecondary pt-5">
                    vs
                  </p>
                  <p className="text-[36px] font-bold text-newSecondary">5$</p>
                </div>

                <div className="flex items-center justify-center flex-col items-bottom space-y-1">
                  <Button className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full text-[13px] w-36 hover:scale-[1.1]">
                    Invite
                  </Button>
                  <p className="text-[24px] font-bold text-white"></p>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                      <img
                        src="/user.png"
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-[13px] text-newSecondary">lionesquex</p>
                  </div>
                </div>
              </div> */}
              {/*-------------------------------- Eighth Card -------------------------------------*/}

              {/*-------------------------------- Credit Transaction Card -------------------------------------*/}
              <div className="w-full my-4">
                <div className="w-full  bg-tertiary shadow-md rounded-[15px] p-2 flex flex-row items-center space-x-4">
                  {/* Transaction Icon */}
                  <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300">
                    <GoArrowDownLeft className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300" />
                  </div>

                  {/* User Profile Image */}
                  <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-[5px] bg-gray-300 overflow-hidden">
                    <img
                      src="/user.png"
                      alt="User"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-grow text-left">
                    <p className="text-[14px] md:text-[18px] font-semibold text-newSecondary">
                      username
                    </p>
                    <p className="text-[12px] md:text-[16px] text-newPrimary">
                      credit
                    </p>
                  </div>

                  {/* Transaction Amount */}
                  <div className="flex-grow text-right">
                    <p className="text-[18px] md:text-[24px] font-semibold text-white">
                      $00.00
                    </p>
                  </div>
                </div>
              </div>
              {/*-------------------------------- Credit Transaction Card -------------------------------------*/}

              {/*-------------------------------- Debit Transaction Card -------------------------------------*/}
              <div className="w-full my-4">
                <div className="w-full  bg-tertiary shadow-md rounded-[15px] p-2 flex flex-row items-center space-x-4">
                  {/* Transaction Icon */}
                  <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300">
                    <GoArrowUpRight className="w-6 h-6 md:w-8 md:h-8 rounded-full text-newSecondary" />
                  </div>

                  {/* User Profile Image */}
                  <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-[5px] bg-gray-300 overflow-hidden">
                    <img
                      src="/user.png"
                      alt="User"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-grow text-left">
                    <p className="text-[14px] md:text-[18px] font-semibold text-newSecondary">
                      username
                    </p>
                    <p className="text-[12px] md:text-[16px] text-newPrimary">
                      credit
                    </p>
                  </div>

                  {/* Transaction Amount */}
                  <div className="flex-grow text-right">
                    <p className="text-[18px] md:text-[24px] font-semibold text-white">
                      $00.00
                    </p>
                  </div>
                </div>
              </div>
              {/*-------------------------------- Debit Transaction Card -------------------------------------*/}

              {/*-------------------------------- Proper Layout Card -------------------------------------*/}
              <div className="w-full md:flex md:justify-center pb-4">
                <div className="min-h-[160px] sm:min-w-[500px] bg-tertiary shadow-md rounded-[25px] px-4 py-6 flex flex-col justify-between items-center mt-6 space-y-4 relative">
                  <div className="w-full flex justify-center md:justify-end gap-3 md:gap-5">
                    <Button className="bg-newSecondary hover:bg-orange-600 text-dark py-3 px-2 h-5 rounded-full text-[12px] sm:text-[14px] hover:scale-[1.1] transition-transform min-w-20">
                      Invite
                    </Button>
                  </div>
                  <div className="w-full flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    {/* Left side teams */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col justify-center items-center space-y-2">
                        <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                          <img
                            src="/user.png"
                            alt="Profile"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className="text-[13px] text-newSecondary font-bold">
                          teamName
                        </p>
                        <div className="flex space-x-2 mt-1">
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                              <img
                                src="/user.png"
                                alt="Profile"
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="text-[13px] text-newSecondary font-bold">Player1</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VS Section */}
                    <div className="flex flex-col items-center mx-4 text-center">
                      <p className="text-[24px] font-bold text-white">
                        gameName
                      </p>
                      <p className="text-[24px] font-bold text-newSecondary">
                        VS
                      </p>
                      <p className="text-[36px] font-bold text-newSecondary">
                        20$
                      </p>
                    </div>

                    {/* Right side teams */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                          <img
                            src="/waiting_icon.png"
                            alt="Profile"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className="text-[13px] text-newSecondary font-bold">
                          Waiting
                        </p>
                        <div className="flex space-x-2 mt-1">
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-[25px] h-[25px] bg-gray-300 rounded-[5px] overflow-hidden">
                              <img
                                src="/user.png"
                                alt="Profile"
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="text-[13px] text-newSecondary font-bold">Waiting</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gap-3 md:gap-5 pt-3 flex items-center justify-evenly">
                    <Button className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full hover:scale-[1.1] rounded-full text-[13px] min-w-24">
                      Bet
                    </Button>
                  </div>
                </div>
              </div>
              {/*-------------------------------- Proper Layout Card -------------------------------------*/}
            </div>
          </div>
          {/* ====== Cards ======= */}

          {/* ====== Loader ======= */}
          <div className="mb-10">
            <h1 className="text-xl font-bold">Loader</h1>
            <div className="items-center mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-b border-gray-200 py-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <div>{loading ? <Loader /> : <div>Your Content</div>}</div>
            </div>
          </div>
          {/* ====== Loader ======= */}
        </div>
      </div>
    </div>
  );
}
