import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import EnglishCountriesUI from "./EnglishCountriesUI";

/* ==========================================================
   ENGLISH LOCAL EXAMINATION COUNTRIES
========================================================== */

const countries = [
  {
    code: "NG",
    name: "Nigeria",
    flag: "\u{1F1F3}\u{1F1EC}",
    phoneCode: "+234",
  },
  {
    code: "GH",
    name: "Ghana",
    flag: "\u{1F1EC}\u{1F1ED}",
    phoneCode: "+233",
  },
  {
    code: "SL",
    name: "Sierra Leone",
    flag: "\u{1F1F8}\u{1F1F1}",
    phoneCode: "+232",
  },
  {
    code: "GM",
    name: "The Gambia",
    flag: "\u{1F1EC}\u{1F1F2}",
    phoneCode: "+220",
  },
  {
    code: "LR",
    name: "Liberia",
    flag: "\u{1F1F1}\u{1F1F7}",
    phoneCode: "+231",
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "\u{1F1F0}\u{1F1EA}",
    phoneCode: "+254",
  },
  {
    code: "UG",
    name: "Uganda",
    flag: "\u{1F1FA}\u{1F1EC}",
    phoneCode: "+256",
  },
  {
    code: "TZ",
    name: "Tanzania",
    flag: "\u{1F1F9}\u{1F1FF}",
    phoneCode: "+255",
  },
  {
    code: "ZM",
    name: "Zambia",
    flag: "\u{1F1FF}\u{1F1F2}",
    phoneCode: "+260",
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    flag: "\u{1F1FF}\u{1F1FC}",
    phoneCode: "+263",
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "\u{1F1FF}\u{1F1E6}",
    phoneCode: "+27",
  },
  {
    code: "BW",
    name: "Botswana",
    flag: "\u{1F1E7}\u{1F1FC}",
    phoneCode: "+267",
  },
  {
    code: "NA",
    name: "Namibia",
    flag: "\u{1F1F3}\u{1F1E6}",
    phoneCode: "+264",
  },
  {
    code: "MW",
    name: "Malawi",
    flag: "\u{1F1F2}\u{1F1FC}",
    phoneCode: "+265",
  },
  {
    code: "LS",
    name: "Lesotho",
    flag: "\u{1F1F1}\u{1F1F8}",
    phoneCode: "+266",
  },
  {
    code: "SZ",
    name: "Eswatini",
    flag: "\u{1F1F8}\u{1F1FF}",
    phoneCode: "+268",
  },
  {
    code: "MU",
    name: "Mauritius",
    flag: "\u{1F1F2}\u{1F1FA}",
    phoneCode: "+230",
  },
];

/* ==========================================================
   ENGINE
========================================================== */

function EnglishCountriesEngine() {
  const navigate = useNavigate();

  const [loadingCountry, setLoadingCountry] = useState("");

  /* ========================================================
     SELECT COUNTRY
  ======================================================== */

  const selectCountry = (country) => {
    if (!country || !country.code) {
      return;
    }

    setLoadingCountry(country.code);

    /* ======================================================
       COMMON COUNTRY CONTEXT
    ====================================================== */

    localStorage.setItem(
      "selectedCountry",
      country.name
    );

    localStorage.setItem(
      "selectedCountryCode",
      country.code
    );

    localStorage.setItem(
      "selectedCountryFlag",
      country.flag
    );

    localStorage.setItem(
      "selectedCountryPhoneCode",
      country.phoneCode
    );

    /* ======================================================
       ENGLISH LOCAL COUNTRY CONTEXT
    ====================================================== */

    localStorage.setItem(
      "englishCountry",
      country.name
    );

    localStorage.setItem(
      "englishCountryCode",
      country.code
    );

    /* ======================================================
       CONTINUE TO EXISTING LOGIN / REGISTER SYSTEM
    ====================================================== */

    navigate("/login", {
      state: {
        country: country.name,
        countryCode: country.code,
        countryFlag: country.flag,
        countryPhoneCode: country.phoneCode,
        source: "english-country-selection",
      },
    });
  };

  /* ========================================================
     BACK
  ======================================================== */

  const backToEnglishPlatform = () => {
    navigate("/english");
  };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <EnglishCountriesUI
      countries={countries}
      loadingCountry={loadingCountry}
      onSelectCountry={selectCountry}
      onBack={backToEnglishPlatform}
    />
  );
}

export default EnglishCountriesEngine;