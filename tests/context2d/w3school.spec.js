'use strict'
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe('Context2D W3School', () => {

    it('context2d: fillStyle', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.fillStyle="#FF0000";
		ctx.fillRect(20,20,150,100);

		comparePdf(doc.output(), 'w3s_fillStyle.pdf', 'context2d')
	});

    it('context2d: strokeStyle', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.strokeStyle="#FF0000";
		ctx.strokeRect(20,20,150,100);

		comparePdf(doc.output(), 'w3s_strokeStyle.pdf', 'context2d')
	});
	
    it('context2d: closePath v1', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.beginPath();
		ctx.moveTo(20,20);
		ctx.lineTo(20,100);
		ctx.lineTo(70,100);
		ctx.closePath();
		ctx.stroke();
			
		comparePdf(doc.output(), 'w3s_closePath_v1.pdf', 'context2d')
	});
	
    it('context2d: closePath v2', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.beginPath();
		ctx.moveTo(20,20);
		ctx.lineTo(20,100);
		ctx.lineTo(70,100);
		ctx.closePath();
		ctx.stroke();
		ctx.fillStyle="red";
		ctx.fill();
			
		comparePdf(doc.output(), 'w3s_closePath_v2.pdf', 'context2d')
	});
	
	
    it('context2d: lineCap round', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.lineCap="round";
		ctx.moveTo(20,20);
		ctx.lineTo(200,20);
		ctx.stroke();

		comparePdf(doc.output(), 'w3s_lineCap_round.pdf', 'context2d')
	});
	
    it('context2d: lineCap butt', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.lineCap="butt";
		ctx.moveTo(20,20);
		ctx.lineTo(200,20);
		ctx.stroke();

		comparePdf(doc.output(), 'w3s_lineCap_butt.pdf', 'context2d')
	});
	
    it('context2d: lineCap square', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.lineCap="square";
		ctx.moveTo(20,20);
		ctx.lineTo(200,20);
		ctx.stroke();

		comparePdf(doc.output(), 'w3s_lineCap_square.pdf', 'context2d')
	});
	
    it('context2d: lineJoin round', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.lineJoin="round";
		ctx.moveTo(20,20);
		ctx.lineTo(100,50);
		ctx.lineTo(20,100);
		ctx.stroke();
		
		comparePdf(doc.output(), 'w3s_lineJoin_round.pdf', 'context2d')
	});
	
    it('context2d: lineJoin bevel', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.lineJoin="bevel";
		ctx.moveTo(20,20);
		ctx.lineTo(100,50);
		ctx.lineTo(20,100);
		ctx.stroke();
		
		comparePdf(doc.output(), 'w3s_lineJoin_bevel.pdf', 'context2d')
	});
	
    it('context2d: lineJoin miter', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.lineJoin="miter";
		ctx.moveTo(20,20);
		ctx.lineTo(100,50);
		ctx.lineTo(20,100);
		ctx.stroke();
		
		comparePdf(doc.output(), 'w3s_lineJoin_miter.pdf', 'context2d')
	});
	
    it('context2d: lineTo', () => {

		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(300,150);
		ctx.stroke();
			
		comparePdf(doc.output(), 'w3s_lineTo.pdf', 'context2d')
	});
	
	
    it('context2d: arc', () => {

		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.canvas.getContext('2d');
		ctx.beginPath();
		ctx.arc(100,75,50,0,2*Math.PI);
		ctx.stroke()
			
		comparePdf(doc.output(), 'w3s_arc.pdf', 'context2d')
	});
	
    it('context2d: bezierCurveTo', () => {

		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(20,20);
		ctx.bezierCurveTo(20,100,200,100,200,20);
		ctx.stroke();
		comparePdf(doc.output(), 'w3s_bezierCurveTo.pdf', 'context2d');
	});
	
    it('context2d: quadraticCurveTo', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
		ctx.beginPath();
		ctx.moveTo(20,20);
		ctx.quadraticCurveTo(20,100,200,20);
		ctx.stroke();
		comparePdf(doc.output(), 'w3s_quadraticCurveTo.pdf', 'context2d')
	});
	
    it('context2d: clip', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
		ctx.rect(50,20,200,120);
		ctx.stroke();
		ctx.clip();
		// Draw red rectangle after clip()
		ctx.fillStyle="red";
		ctx.fillRect(0,0,150,100);
		comparePdf(doc.output(), 'w3s_clip.pdf', 'context2d')
	});	
	
    it('context2d: scale', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
		
		ctx.strokeRect(5,5,25,15);
		ctx.scale(2,2);
		ctx.strokeRect(5,5,25,15);
		ctx.scale(2,2);
		ctx.strokeRect(5,5,25,15);
		ctx.scale(2,2);
		ctx.strokeRect(5,5,25,15);
		ctx.scale(2,2);
		ctx.strokeRect(5,5,25,15);
		comparePdf(doc.output(), 'w3s_scale.pdf', 'context2d')
	});
	
    it('context2d: rotate', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.rotate(20*Math.PI/180);
		ctx.fillRect(50,20,100,50);
		comparePdf(doc.output(), 'w3s_rotate.pdf', 'context2d')
	});
	
    it('context2d: translate', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		ctx.fillRect(10,10,100,50);
		ctx.translate(70,70);
		ctx.fillRect(10,10,100,50);	
		comparePdf(doc.output(), 'w3s_translate.pdf', 'context2d')
	});
	
    it('context2d: transform', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
	
		ctx.fillStyle="yellow";
		ctx.fillRect(0,0,250,100)

		ctx.transform(1,0.5,-0.5,1,30,10);
		ctx.fillStyle="red";
		ctx.fillRect(0,0,250,100);

		ctx.transform(1,0.5,-0.5,1,30,10);
		ctx.fillStyle="blue";
		ctx.fillRect(0,0,250,100);
		comparePdf(doc.output(), 'w3s_transform.pdf', 'context2d')
	});

    it('context2d: setTransform', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
	
		ctx.fillStyle="yellow";
		ctx.fillRect(0,0,250,100)

		ctx.setTransform(1,0.5,-0.5,1,30,10);
		ctx.fillStyle="red";
		ctx.fillRect(0,0,250,100);

		ctx.setTransform(1,0.5,-0.5,1,30,10);
		ctx.fillStyle="blue";
		ctx.fillRect(0,0,250,100);
		comparePdf(doc.output(), 'w3s_setTransform.pdf', 'context2d')
	});
	
    it('context2d: font', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
	
		ctx.font="30px Arial";
		ctx.fillText("Hello World",10,50);
		comparePdf(doc.output(), 'w3s_font.pdf', 'context2d')
	});
	
    it('context2d: textBaseline', () => {

		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;

		//Draw a red line at y=100
		ctx.strokeStyle="red";
		ctx.moveTo(5,100);
		ctx.lineTo(395,100);
		ctx.stroke();

		ctx.font="20px Arial"

		//Place each word at y=100 with different textBaseline values
		ctx.textBaseline="top"; 
		ctx.fillText("Top",5,100); 
		ctx.textBaseline="bottom"; 
		ctx.fillText("Bottom",50,100); 
		ctx.textBaseline="middle"; 
		ctx.fillText("Middle",120,100); 
		ctx.textBaseline="alphabetic"; 
		ctx.fillText("Alphabetic",190,100); 
		ctx.textBaseline="hanging"; 
		ctx.fillText("Hanging",290,100);
		comparePdf(doc.output(), 'w3s_textBaseline.pdf', 'context2d')
	});
	
	
    it('context2d: textAlign', () => {

		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
	
		// Create a red line in position 150
		ctx.strokeStyle="red";
		ctx.moveTo(150,20);
		ctx.lineTo(150,170);
		ctx.stroke();

		ctx.font="15px Arial"; 

		// Show the different textAlign values
		ctx.textAlign="start"; 
		ctx.fillText("textAlign=start",150,60); 
		ctx.textAlign="end"; 
		ctx.fillText("textAlign=end",150,80); 
		ctx.textAlign="left"; 
		ctx.fillText("textAlign=left",150,100);
		ctx.textAlign="center"; 
		ctx.fillText("textAlign=center",150,120); 
		ctx.textAlign="right"; 
		ctx.fillText("textAlign=right",150,140);
		comparePdf(doc.output(), 'w3s_textAlign.pdf', 'context2d')
	});
	
	
    it('context2d: fillText', () => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
			
		ctx.font="20px Georgia";
		ctx.fillText("Hello World!",10,50
		comparePdf(doc.output(), 'w3s_fillText.pdf', 'context2d')
	});
	
    it('context2d: strokeText') => {
		var doc = new jsPDF('p', 'pt', 'a4');
		var ctx = doc.context2d;
			
		ctx.font="20px Georgia";
		ctx.strokeText("Hello World!",10,50);
	});
	
});
