interface PrefixMap {
  [index: number]: string;
}

class ModuleFormat {
  private static readonly Prefixes: PrefixMap = {
    1: "K",
    2: "M",
    3: "B",
    4: "T",
    5: "Qd",
    6: "Qn",
    7: "Sx",
    8: "Sp",
    9: "Oc",
    10: "No",
    11: "De",
    12: "UDe",
    13: "DDe",
    14: "TDe",
    15: "QtDe",
    16: "QnDe",
    17: "SxDe",
    18: "SpDe",
    19: "OcDe",
    20: "NoDe",
    21: "Vg",
    22: "UVg",
    23: "DVg",
    24: "TVg",
    25: "QdVg",
    26: "QnVg",
    27: "SxVg",
    28: "SpVg",
    29: "OcVg",
    30: "NoVg",
    31: "Tg",
    32: "UTg",
    33: "DTg",
    34: "TTg",
    35: "QdTg",
    36: "QnTg",
    37: "SxTg",
    38: "SpTg",
    39: "OcTg",
    40: "NoTg",
    41: "qg",
    42: "Uqg",
    43: "Dqg",
    44: "Tqg",
    45: "Qdqg",
    46: "Qnqg",
    47: "Sxqg",
    48: "Spqg",
    49: "Ocqg",
    50: "Noqg",
    51: "Qg",
    52: "UQg",
    53: "DQg",
    54: "TQg",
    55: "QdQg",
    56: "QnQg",
    57: "SxQg",
    58: "SpQg",
    59: "OcQg",
    60: "NoQg",
    61: "sg",
    62: "Usg",
    63: "Dsg",
    64: "Tsg",
    65: "Qdsg",
    66: "Qnsg",
    67: "Sxsg",
    68: "Spsg",
    69: "Ocsg",
    70: "Nosg",
    71: "Sg",
    72: "USg",
    73: "DSg",
    74: "TSg",
    75: "QdSg",
    76: "QnSg",
    77: "SxSg",
    78: "SpSg",
    79: "OcSg",
    80: "NoSg",
    81: "Og",
    82: "UOg",
    83: "DOg",
    84: "TOg",
    85: "QdOg",
    86: "QnOg",
    87: "SxOg",
    88: "SpOg",
    89: "OcOg",
    90: "NoOg",
    91: "Ng",
    92: "UNg",
    93: "DNg",
    94: "TNg",
    95: "QdNg",
    96: "QnNg",
    97: "SxNg",
    98: "SpNg",
    99: "OcNg",
    100: "NoNg",
    101: "Ce",
    102: "UCe",
  };

    private static cutDigits(x: number, digits: number): string {
      if (x - Math.floor(x) === 0) return x.toString();
      return x.toFixed(digits);
  }

  public static en(number: number, digits: number = 2): string {
      if (number === 0) return number.toString();

      const sign = number < 0 ? "-" : "";
      number = Math.abs(number);

      if (number < 1) return sign + this.cutDigits(number, digits);

      const suffix: number = Math.floor(Math.log10(number) / 3);

      return sign + this.cutDigits(number / Math.pow(1000, suffix), digits) + (this.Prefixes[Math.floor(suffix)] || "");
  }
}

export default ModuleFormat;
