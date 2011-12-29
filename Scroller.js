// a simple scrolling class, which needs some tuning
function Scroller(nme)
  {
    this.id = name || '$SCREEN';
    this.scrollTimer = null;
    this.scrollSpeed = 20;
    this.scrollPathX = new Array();
    this.scrollPathY = new Array();
	this.NS = (navigator.appName.indexOf('Netscape')!=-1);
	this.IE = (!this.NS);
    this.targX = 0;
    this.targY = 0;
    this.curX = 0;
    this.curY = 0;
    this.easing = null; 
//-------------------------------------------------- SetFactor
    this.SetFactor = function(fct)
      {
        this.factor = fct || .1;
        return;
      }
//-------------------------------------------------- SetEasing
    this.SetEasing = function(ea)
      {
        this.easing
          = (ea == 'start') ? 'start'
          : (ea == 'end') ? 'end'
          : (typeof(ea) == 'number') ? ea
          : null;
        return;
      }
//-------------------------------------------------- runPath
    this.RunPath = function(stp)
      {
        if(this.scrollPathX[stp])
          {
            document.SCRLAYER.left = -this.scrollPathX[stp]; 
            document.SCRLAYER.top = -this.scrollPathY[stp];
            setTimeout(this.id + ".RunPath(" + (++stp) + ")",this.scrollSpeed);
          }
        else { this.EndScroll(); }
        return;
      }
//---------------------------------------------------- endScroll
    this.EndScroll = function()
      {
        this.scrollOn = false;
		this.lastDistX = this.curX-this.lastX;
		this.lastDistY = this.curY-this.lastY;
		with(document.all['BLAH2'].style)
		  {
		    pixelLeft += this.lastDistX;
		    pixelTop += this.lastDistY;
		  }
		with(document.all['VIEWER'].style)
		  {
		    pixelLeft += this.lastDistX;
		    pixelTop += this.lastDistY;
		  }
		moveCrosshairs(VIEWER.style.pixelLeft,VIEWER.style.pixelTop);
        return;
      }

//---------------------------------------------------- MoveTo
    this.MoveTo = function(targX,targY)
      {
        if(!this.scrollOn)
          {
            this.scrollOn = true;
            // kill further events in IE (to avoid a disrupting focus, etc.)
            if(this.IE && window.event)
              {
                window.event.cancelBubble = true;
                window.event.returnValue = false;
              }
            this.lastX = this.curX;
			this.lastY = this.curY;
            this.targX = targX || 1;
            this.targY = targY || 1;

            // clean up any current scrolling information
            this.scrollPathX = new Array();
            this.scrollPathY = new Array();

            var V = ((this.targX - this.curX) == 0); // check for vertical
            var S = (V) ? 0 : (this.targY - this.curY) / (this.targX - this.curX); 
            var Y = this.curY - (S * this.curX);
			var ST = 0;

            while((this.curY != this.targY) || (this.curX != this.targX))
              {
                ST = 
				(this.easing == 'start') ? ST * (1+this.factor)
                : (this.easing == 'end') ? Math.ceil(((this.targY > this.curY) ? this.targY - this.curY : this.curY - this.targY) * this.factor ) 
                : (typeof(this.easing) == 'number') ? this.easing
				: 1000000000; //  arbitrary large number to effect instant scroll
				
				ST = Math.max(1,ST); // keep it real

                if(V)
                  {
                    this.curX = this.targX;
                    this.curY = (this.targY < this.curY) ? Math.max(this.curY - ST,this.targY) : Math.min(this.curY + ST,this.targY); 
                  }
                else
                  {
                    this.curX = (this.targX < this.curX) ? Math.max(this.curX - ST,this.targX) : Math.min(this.curX + ST,this.targX); 
                    this.curY = Math.round(Y + (S * this.curX));
                  }
                if(this.IE) { window.scrollTo(this.curX,this.curY); }
                else
                  {
                    this.scrollPathX[this.scrollPathX.length] = this.curX;
                    this.scrollPathY[this.scrollPathY.length] = this.curY;
                  }
              }
			if(this.IE) { this.EndScroll(); } else { this.RunPath(0); }
            return;
          }
       }
    return;
  }

