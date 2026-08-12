/**
 * Quiz "¿No sabes qué color elegir?" en la página de producto.
 * Estructura y estilos del overlay/tarjeta viven 100% en elementos nativos
 * de Bricks dentro de la propia plantilla de producto (id 521): un bloque
 * "Overlay Quiz de Color" en posición fija, oculto por defecto. No usamos
 * el popup nativo de Bricks porque no llega a renderizarse cuando el
 * disparador vive dentro de una plantilla de tipo producto (mismo tipo de
 * limitación que ya vimos con el offcanvas).
 * Aquí solo va: abrir/cerrar el overlay (equivalente a lo que haría el
 * propio popup) y la lógica dinámica del quiz (preguntas, puntuación,
 * resultado), porque el número de preguntas/respuestas varía y no tiene
 * sentido construir variantes estáticas condicionadas en Bricks para esto.
 * Al final, selecciona la variación real en el selector de color de la
 * página (mismo mecanismo que ya usa WPVS).
 */
document.addEventListener( 'DOMContentLoaded', function () {
	var overlay = document.getElementById( 'quiz-overlay' );
	// Puede haber más de un disparador (el de la ficha en escritorio y el de
	// la barra fija en móvil), así que se enganchan todos, no solo el primero.
	var triggers = document.querySelectorAll( '.quiz-color-trigger' );
	var cerrar = document.getElementById( 'quiz-cerrar' );
	var preguntas = document.getElementById( 'quiz-vista-preguntas' );
	var resultado = document.getElementById( 'quiz-vista-resultado' );
	var progreso = document.getElementById( 'quiz-progreso-relleno' );

	if ( ! overlay || ! triggers.length || ! preguntas || ! resultado || ! progreso ) {
		return;
	}

	function abrirQuiz() {
		overlay.style.display = 'flex';
		resetState();
		preguntas.style.display = 'block';
		resultado.style.display = 'none';
		renderQuestion();
	}

	function cerrarQuiz() {
		overlay.style.display = 'none';
	}

	triggers.forEach( function ( trigger ) {
		trigger.addEventListener( 'click', abrirQuiz );
	} );
	if ( cerrar ) {
		cerrar.addEventListener( 'click', cerrarQuiz );
	}
	overlay.addEventListener( 'click', function ( e ) {
		if ( e.target === overlay ) {
			cerrarQuiz();
		}
	} );

	// Slug real del término de atributo (attribute_pa_color) para cada color.
	var COLORS = {
		marfil: { name: 'Marfil', hex: '#efe4d4', desc: 'Elegante y delicado. Aporta luminosidad y una sensación de pureza y calma.', slug: 'marfil' },
		topo: { name: 'Topo', hex: '#c6a58f', desc: 'Cálido y sofisticado. Transmite bienestar y armonía a tu espacio.', slug: 'topo' },
		gris: { name: 'Gris azulado', hex: '#8996a3', desc: 'Moderno y versátil. Aporta equilibrio y un toque contemporáneo.', slug: 'gris-azulado' },
		granate: { name: 'Granate', hex: '#7c2634', desc: 'Intenso y elegante. Aporta calidez y profundidad a tu habitación.', slug: 'granate' },
		pavoreal: { name: 'Azul pavo real', hex: '#15748c', desc: 'Vibrante y lujoso. Aporta energía, confianza y sofisticación.', slug: 'azul-pavo-real' },
		navy: { name: 'Azul navy', hex: '#1c2c4c', desc: 'Clásico y atemporal. Transmite tranquilidad y favorece un sueño profundo.', slug: 'azul-navy' },
		negro: { name: 'Negro', hex: '#1c1a19', desc: 'Elegante y sofisticado. Aporta un toque de lujo y combina con todo.', slug: 'negro' }
	};

	var QUESTIONS = [
		{
			text: '¿De qué color es tu dormitorio?',
			answers: [
				{ label: 'Blancos y tonos muy claros', swatch: '#f2ede4', scores: { marfil: 3, gris: 2, negro: 1 } },
				{ label: 'Cálidos: beige, madera, terracota', swatch: '#cba586', scores: { topo: 3, granate: 2, marfil: 1 } },
				{ label: 'Fríos: grises o azules', swatch: '#8b98a6', scores: { gris: 3, navy: 3, pavoreal: 1 } },
				{ label: 'Oscuro o con mucha personalidad', swatch: '#2b2622', scores: { negro: 3, granate: 2, navy: 1 } }
			]
		},
		{
			text: '¿Prefieres algo discreto o con contraste?',
			answers: [
				{ label: 'Discreto, que se funda con la decoración', swatch: '#e3d9c9', scores: { marfil: 3, topo: 3, gris: 2 } },
				{ label: 'Con contraste, que destaque', swatch: '#7c2634', scores: { granate: 3, pavoreal: 3, negro: 2 } }
			]
		},
		{
			text: '¿Tu estilo es clásico, moderno o elegante?',
			answers: [
				{ label: 'Clásico', swatch: '#1c2c4c', scores: { marfil: 2, topo: 2, navy: 3 } },
				{ label: 'Moderno', swatch: '#8b98a6', scores: { gris: 3, pavoreal: 2, negro: 1 } },
				{ label: 'Elegante', swatch: '#1c1a19', scores: { granate: 2, negro: 3, navy: 1 } }
			]
		},
		{
			text: '¿Quieres un color fácil de combinar?',
			answers: [
				{ label: 'Sí, que combine con todo', swatch: '#efe4d4', scores: { marfil: 3, negro: 3, topo: 2, gris: 1 } },
				{ label: 'No me importa, quiero personalidad', swatch: '#15748c', scores: { granate: 2, pavoreal: 3, navy: 1 } }
			]
		}
	];

	var scores = {};
	var history = [];
	var step = 0;

	function resetState() {
		Object.keys( COLORS ).forEach( function ( k ) {
			scores[ k ] = 0;
		} );
		history = [];
		step = 0;
	}

	function renderQuestion() {
		var q = QUESTIONS[ step ];

		var backHtml = step > 0
			? '<button type="button" class="quiz-color-back">&larr; Pregunta anterior</button>'
			: '';

		var answersHtml = q.answers.map( function ( a, i ) {
			return '<button type="button" class="quiz-color-answer" data-index="' + i + '">' +
				'<span class="quiz-color-swatch" style="background:' + a.swatch + '"></span>' +
				'<span>' + a.label + '</span>' +
				'</button>';
		} ).join( '' );

		preguntas.innerHTML =
			'<p class="quiz-color-step">Pregunta ' + ( step + 1 ) + ' de ' + QUESTIONS.length + '</p>' +
			'<h3 class="quiz-color-question">' + q.text + '</h3>' +
			'<div class="quiz-color-answers">' + answersHtml + '</div>' +
			backHtml;

		progreso.style.width = ( ( step / QUESTIONS.length ) * 100 ) + '%';

		preguntas.querySelectorAll( '.quiz-color-answer' ).forEach( function ( btn ) {
			btn.addEventListener( 'click', function () {
				selectAnswer( q.answers[ parseInt( btn.dataset.index, 10 ) ] );
			} );
		} );

		var back = preguntas.querySelector( '.quiz-color-back' );
		if ( back ) {
			back.addEventListener( 'click', function () {
				step -= 1;
				Object.assign( scores, history.pop() );
				renderQuestion();
			} );
		}
	}

	function selectAnswer( answer ) {
		history.push( JSON.parse( JSON.stringify( scores ) ) );
		Object.entries( answer.scores ).forEach( function ( entry ) {
			scores[ entry[0] ] = ( scores[ entry[0] ] || 0 ) + entry[1];
		} );
		step += 1;
		if ( step >= QUESTIONS.length ) {
			progreso.style.width = '100%';
			showResult();
		} else {
			renderQuestion();
		}
	}

	function showResult() {
		var ranked = Object.entries( scores ).sort( function ( a, b ) {
			return b[1] - a[1];
		} );
		var primaryKey = ranked[0][0];
		var altKey = ranked[1][0];
		var primary = COLORS[ primaryKey ];
		var alt = COLORS[ altKey ];

		resultado.innerHTML =
			'<div class="quiz-color-result-top">' +
				'<div class="quiz-color-swatch-hero" style="background:' + primary.hex + '"></div>' +
				'<div>' +
					'<p class="quiz-color-kicker">Tu funda ideal</p>' +
					'<h3 class="quiz-color-result-name">' + primary.name + '</h3>' +
				'</div>' +
			'</div>' +
			'<p class="quiz-color-copy"><strong>' + primary.name + '</strong> es tu combinación perfecta. ' + primary.desc + '</p>' +
			'<div class="quiz-color-alt">' +
				'<div class="quiz-color-alt-swatch" style="background:' + alt.hex + '"></div>' +
				'<div>También te podría gustar <b>' + alt.name + '</b>: ' + alt.desc + '</div>' +
			'</div>' +
			'<div class="quiz-color-cta-row">' +
				'<button type="button" class="quiz-color-cta-primary">Seleccionar este color <span>&rsaquo;</span></button>' +
				'<button type="button" class="quiz-color-restart">Volver a empezar</button>' +
			'</div>';

		preguntas.style.display = 'none';
		resultado.style.display = 'block';

		resultado.querySelector( '.quiz-color-cta-primary' ).addEventListener( 'click', function () {
			selectVariation( primary.slug );
		} );
		resultado.querySelector( '.quiz-color-restart' ).addEventListener( 'click', function () {
			resetState();
			resultado.style.display = 'none';
			preguntas.style.display = 'block';
			renderQuestion();
		} );
	}

	function selectVariation( slug ) {
		var swatch = document.querySelector( '.vi-wpvs-option-wrap[data-attribute_value="' + slug + '"]' );
		if ( swatch ) {
			swatch.click();
		}
		cerrarQuiz();
		var addToCart = document.querySelector( '.brxe-product-add-to-cart' );
		if ( addToCart ) {
			addToCart.scrollIntoView( { behavior: 'smooth', block: 'center' } );
		}
	}
} );
