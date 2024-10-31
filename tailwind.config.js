
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "./index.html",
  ],
  mode: 'jit',
  prefix: "",
  safelist: [
    'bg-light',
    'bg-dark',
    'bg-system',
    'border-light',
    'border-dark',
    'border-system',
    'text-light',
    'text-dark',
    'text-system',

    //hover
    'hover:text-light',
    'hover:text-dark',
    'hover:text-system',

    'hover:border-light',
    'hover:border-dark',
    'hover:border-system',

    'hover:bg-light',
    'hover:bg-dark',
    'hover:bg-system',

    //button
    'btn-light', 'btn-dark', 'btn-system',
    'hover:btn-light', 'hover:btn-dark', 'hover:btn-system',
  ],
  theme: {
  	container: {
  		center: 'true',
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	colors: {
  		transparent: 'transparent',
  		current: 'currentColor',
  		newPrimary: '#0056D2',
  		newSecondary: '#E14449',
  		tertiary: '#00FF66',
		black: '#000000'
  	},
  	backgroundImage: {
  		'gradient-custom': 'linear-gradient(to bottom, #0256CE, #2B2C2E)'
  	},
  	extend: {
		fontFamily: {
			archivo: ['Archivo', 'sans-serif'],
		  },
  		typography: {
  			DEFAULT: {
  				css: {
  					h1: {
  						fontSize: '2.25rem',
  						lineHeight: '2.5rem',
  						fontFamily: 'Playwrite USA Traditional cursive", cursive'
  					},
  					h2: {
  						fontSize: '1.875rem',
  						lineHeight: '2.25rem'
  					},
  					h3: {
  						fontSize: '1.5rem',
  						lineHeight: '2rem'
  					},
  					h4: {
  						fontSize: '1.25rem',
  						lineHeight: '1.75rem'
  					},
  					h5: {
  						fontSize: '1.125rem',
  						lineHeight: '1.5rem'
  					},
  					h6: {
  						fontSize: '1rem',
  						lineHeight: '1.5rem'
  					},
  					'.subtitle': {
  						fontSize: '1.25rem',
  						lineHeight: '1.75rem'
  					},
  					'.title': {
  						fontSize: '1.125rem',
  						lineHeight: '1.5rem'
  					},
  					body: {
  						fontSize: '1rem',
  						lineHeight: '1.5rem'
  					},
  					p: {
  						fontSize: '0.875rem',
  						lineHeight: '1.25rem'
  					},
  					'.card-title': {
  						fontSize: '1.125rem',
  						lineHeight: '1.5rem'
  					},
  					'.card-body': {
  						fontSize: '1rem',
  						lineHeight: '1.5rem'
  					}
  				}
  			}
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			zinc: {
  				'50': '#fafafa',
  				'100': '#f4f4f5',
  				'200': '#e4e4e7',
  				'300': '#d4d4d8',
  				'400': '#a1a1aa',
  				'500': '#71717a',
  				'600': '#52525b',
  				'700': '#3f3f46',
  				'800': '#27272a',
  				'900': '#18181b',
  				'950': '#09090b'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		backgroundColor: {
  			light: '#fafafa',
  			dark: '#09090b',
  			system: '#d4d4d8'
  		},
  		borderColor: {
  			light: '#09090b',
  			dark: '#fafafa',
  			system: '#52525b'
  		},
  		textColor: {
  			light: '#09090b',
  			dark: '#fafafa',
  			system: '#09090b'
  		},
  		buttonColor: {
  			light: '#c026d3',
  			dark: '#fafafa',
  			system: '#09090b'
  		},
  		variants: {
  			extend: {
  				backgroundColor: ['hover'],
  				borderColor: ['hover'],
  				textColor: ['hover']
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-100% - var(--gap)))'
  				}
  			},
  			'marquee-vertical': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(calc(-100% - var(--gap)))'
  				}
  			},
  			'background-position-spin': {
  				'0%': {
  					backgroundPosition: 'top center'
  				},
  				'100%': {
  					backgroundPosition: 'bottom center'
  				}
  			},
  			'shine-pulse': {
  				'0%': {
  					'background-position': '0% 0%'
  				},
  				'50%': {
  					'background-position': '100% 100%'
  				},
  				to: {
  					'background-position': '0% 0%'
  				}
  			},
  			'spin-around': {
  				'0%': {
  					transform: 'translateZ(0) rotate(0)'
  				},
  				'15%, 35%': {
  					transform: 'translateZ(0) rotate(90deg)'
  				},
  				'65%, 85%': {
  					transform: 'translateZ(0) rotate(270deg)'
  				},
  				'100%': {
  					transform: 'translateZ(0) rotate(360deg)'
  				}
  			},
  			slide: {
  				to: {
  					transform: 'translate(calc(100cqw - 100%), 0)'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					boxShadow: '0 0 0 0 var(--pulse-color)'
  				},
  				'50%': {
  					boxShadow: '0 0 0 8px var(--pulse-color)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			marquee: 'marquee var(--duration) infinite linear',
  			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
  			backgroundPositionSpin: 'background-position-spin 3000ms infinite alternate',
  			pulse: 'pulse var(--duration) ease-out infinite'
  		}
  	}
  },
  variants: {
    extend: {
      typography: ["responsive"],
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography",)],
};
