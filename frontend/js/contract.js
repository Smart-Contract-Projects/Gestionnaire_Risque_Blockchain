export const CONTRACT_ADDRESS = "0x4873439168aA647936F1806057F434dC61F10d83";
export const ABI =  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "contrepartie",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "expositionActuelle",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "limite",
        "type": "uint256"
      }
    ],
    "name": "AlerteLimiteDepassee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "contrepartie",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "typeAlerte",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "valeur",
        "type": "uint256"
      }
    ],
    "name": "AlerteRisqueEleve",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "expediteur",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contrepartie",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "nouvelleExposition",
        "type": "int256"
      }
    ],
    "name": "MiseAJourExposition",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "contrepartie",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nouvelleGarantie",
        "type": "uint256"
      }
    ],
    "name": "MiseAJourGarantie",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "identifiant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "limite",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "creditScore",
        "type": "uint256"
      }
    ],
    "name": "NouvelleContrepartie",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "de",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "vers",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "valeur",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "horodatage",
        "type": "uint256"
      }
    ],
    "name": "NouvelleOperation",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "identifiant",
        "type": "address"
      }
    ],
    "name": "ReactivationContrepartie",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_identifiant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "ajoutExposition",
        "type": "uint256"
      }
    ],
    "name": "actualiserExposition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_identifiant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "nouvelleGarantie",
        "type": "uint256"
      }
    ],
    "name": "actualiserGarantie",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "administrateur",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_identifiant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_creditScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_limite",
        "type": "uint256"
      }
    ],
    "name": "ajouterContrepartie",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_identifiant",
        "type": "address"
      }
    ],
    "name": "calculerRatioGarantie",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_identifiant",
        "type": "address"
      }
    ],
    "name": "calculerRisque",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "contreparties",
    "outputs": [
      {
        "internalType": "address",
        "name": "identifiant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "creditScore",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limite",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "exposition",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "garantie",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "estActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recepteur",
        "type": "address"
      },
      {
        "internalType": "int256",
        "name": "valeur",
        "type": "int256"
      }
    ],
    "name": "enregistrerTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "listeContreparties",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "obtenirHistoriqueTransactions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "expediteur",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "recepteur",
            "type": "address"
          },
          {
            "internalType": "int256",
            "name": "valeur",
            "type": "int256"
          },
          {
            "internalType": "uint256",
            "name": "horodatage",
            "type": "uint256"
          }
        ],
        "internalType": "struct GestionnaireRisques.EnregistrementTransaction[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "obtenirListeContreparties",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_identifiant",
        "type": "address"
      }
    ],
    "name": "reactiverContrepartie",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "relationsExposition",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];