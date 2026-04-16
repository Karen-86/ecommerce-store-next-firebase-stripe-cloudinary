import React from "react";
import LOCAL_DATA from "@/conststants/localData";

const { guideBannerImage1, guideBannerImage2, guideBannerImage3 } = LOCAL_DATA.images;

const GuideBanner = () => {
  return (
    <div className="guide-banner bg-gray-100 p-5 sm:p-10 rounded-md flex flex-col md:flex-row md:flex-wrap justify-between gap-5 sm:gap-10">
      <div className="card guide-card flex gap-5 items-center flex-1 sm:min-w-[350px]">
        <div className="card-image mb-2 w-[80px] sm:w-[130px]">
          <img src={guideBannerImage1} alt="" />
        </div>
        <div className="card-content flex-1">
          <div className="card-step w-8 h-8 bg-white font-semibold text-gray-600 rounded-full flex items-center justify-center text-sm mb-2">
            01
          </div>
          <h4 className="card-title font-medium! mb-1 text-lg">Best quality</h4>
          <div className="card-description text-secondary text-sm">Not only fast for us quality is also number one</div>
        </div>
      </div>

      <div className="card guide-card flex gap-5 items-center flex-1 sm:min-w-[350px]">
        <div className="card-image mb-2 w-[80px] sm:w-[130px]">
          <img src={guideBannerImage2} alt="" />
        </div>
        <div className="card-content flex-1">
          <div className="card-step w-8 h-8 bg-white font-semibold text-gray-600 rounded-full flex items-center justify-center text-sm mb-2">
            02
          </div>
          <h4 className="card-title font-medium! mb-1 text-lg">Easy to order</h4>
          <div className="card-description text-secondary text-sm">You only need a few steps in ordering food</div>
        </div>
      </div>

      <div className="card guide-card flex gap-5 items-center flex-1 sm:min-w-[350px] lg:max-w-[400px] lg:mx-auto">
        <div className="card-image mb-2 w-[80px] sm:w-[130px]">
          <img src={guideBannerImage3} alt="" />
        </div>
        <div className="card-content flex-1">
          <div className="card-step w-8 h-8 bg-white font-semibold text-gray-600 rounded-full flex items-center justify-center text-sm mb-2">
            03
          </div>
          <h4 className="card-title font-medium! mb-1 text-lg">Fastest delivery</h4>
          <div className="card-description text-secondary text-sm">Delivery that is always on time even faster</div>
        </div>
      </div>
    </div>
  );
};

export default GuideBanner;
